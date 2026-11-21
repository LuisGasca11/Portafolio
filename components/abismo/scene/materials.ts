import type * as ThreeNamespace from "three";
import type { Three } from "./context";

/**
 * Cáusticas: el patrón de luz que el oleaje proyecta bajo el agua. Función
 * GLSL compartida por todos los shaders (devuelve 0–1 aprox.).
 */
export const causticGlsl = /* glsl */ `
float causticAt(vec2 p, float t) {
  vec2 q = p * 0.22;
  vec2 i = q;
  float c = 0.0;
  for (int n = 0; n < 3; n++) {
    float tt = t * 0.45 * (1.0 + float(n) * 0.35);
    i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / 0.012), q.y / (cos(i.y + tt) / 0.012)));
  }
  c /= 3.0;
  c = 1.2 - pow(c, 1.4);
  return clamp(pow(abs(c), 7.0), 0.0, 1.6);
}
`;

export type CreatureOptions = {
  color: number;
  /** Color del vientre (contrasombreado: lomo oscuro, vientre claro). */
  belly?: number;
  emissive?: number;
  roughness?: number;
  /** Facetas visibles (rocas); por defecto, sombreado suave. */
  faceted?: boolean;
  /** Patrón sobre la piel. */
  pattern?: "scutes" | "spots" | "stripes";
  /** Ondulación al nadar: amplitud, frecuencia a lo largo de z y velocidad. */
  swim?: { amp: number; freq: number; speed: number; phase?: number; from?: number };
  /** Aleteo de mantarraya: onda que viaja del cuerpo a la punta del ala. */
  flap?: { amp: number; speed: number; phase?: number };
  transparent?: boolean;
  opacity?: number;
  side?: ThreeNamespace.Side;
};

export type WaterKit = {
  /** Intensidad de las cáusticas (alta en la superficie, nula en el fondo). */
  caustic: { value: number };
  creature: (options: CreatureOptions) => ThreeNamespace.MeshStandardMaterial;
};

/**
 * Materiales de criaturas y objetos: sombreado suave con cáusticas que se
 * mueven sobre el lomo, brillo de contorno del color del agua y vientre
 * claro. El color sale ya codificado en sRGB porque la escena se dibuja en
 * un búfer intermedio (ver `post.ts`).
 */
export function createWaterKit(
  THREE: Three,
  time: { value: number },
  track: <T extends { dispose: () => void }>(item: T) => T,
): WaterKit {
  const caustic = { value: 1 };
  const rim = { value: new THREE.Color(0x7fe4ff) };

  const creature = (options: CreatureOptions) => {
    const material = track(
      new THREE.MeshStandardMaterial({
        color: options.color,
        emissive: options.emissive ?? 0x000000,
        roughness: options.roughness ?? 0.55,
        metalness: 0,
        flatShading: options.faceted === true,
        transparent: options.transparent === true,
        opacity: options.opacity ?? 1,
        side: options.side ?? THREE.FrontSide,
        depthWrite: options.transparent !== true,
      }),
    );
    const belly = new THREE.Color(options.belly ?? options.color);
    const swim = options.swim;
    const flap = options.flap;
    const pattern = options.pattern;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = time;
      shader.uniforms.uCaustic = caustic;
      shader.uniforms.uRim = rim;
      shader.uniforms.uBelly = { value: belly };
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          varying vec3 vWPos; varying vec3 vWNormal; varying vec3 vLocal;`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vLocal = position;
          ${
            swim
              ? `{ float body = smoothstep(${(swim.from ?? 0.5).toFixed(2)}, -3.0, transformed.z);
                 transformed.x += sin(uTime * ${swim.speed.toFixed(2)} - transformed.z * ${swim.freq.toFixed(2)} + ${(swim.phase ?? 0).toFixed(2)}) * ${swim.amp.toFixed(3)} * body; }`
              : ""
          }
          ${
            flap
              ? `{ float span = abs(transformed.x);
                 transformed.y += sin(uTime * ${flap.speed.toFixed(2)} - span * 0.9 + ${(flap.phase ?? 0).toFixed(2)}) * ${flap.amp.toFixed(3)} * pow(span, 1.35); }`
              : ""
          }`,
        )
        .replace(
          "#include <project_vertex>",
          `#include <project_vertex>
          vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vWNormal = normalize(mat3(modelMatrix) * objectNormal);`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime; uniform float uCaustic; uniform vec3 uRim; uniform vec3 uBelly;
          varying vec3 vWPos; varying vec3 vWNormal; varying vec3 vLocal;
          ${causticGlsl}
          vec2 cellHash(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
          float cellEdge(vec2 p){
            vec2 g = floor(p); vec2 f = fract(p); float d1 = 8.0; float d2 = 8.0;
            for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
              vec2 o = vec2(float(x), float(y)); vec2 r = o + cellHash(g + o) - f; float d = dot(r, r);
              if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
            }
            return sqrt(d2) - sqrt(d1);
          }`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          {
            float up = normalize(vWNormal).y;
            diffuseColor.rgb = mix(uBelly, diffuseColor.rgb, smoothstep(-0.45, 0.2, up));
            ${pattern === "scutes" ? "diffuseColor.rgb *= mix(0.45, 1.05, smoothstep(0.02, 0.16, cellEdge(vLocal.xz * 2.2)));" : ""}
            ${pattern === "spots" ? "diffuseColor.rgb = mix(diffuseColor.rgb, uBelly * 1.1, (1.0 - smoothstep(0.05, 0.22, cellEdge(vLocal.xz * 3.0 + vLocal.y))) * 0.6);" : ""}
            ${pattern === "stripes" ? "diffuseColor.rgb *= 0.55 + 0.45 * smoothstep(0.25, 0.55, abs(sin(vLocal.z * 7.0)));" : ""}
          }`,
        )
        .replace(
          "#include <opaque_fragment>",
          `{
            vec3 n = normalize(vWNormal);
            float lit = max(0.0, n.y * 0.8 + 0.2);
            float c = causticAt(vWPos.xz + vWPos.y * 0.3, uTime) * uCaustic * lit;
            outgoingLight += diffuseColor.rgb * c * 0.9 + vec3(0.55, 0.9, 1.0) * c * 0.08;
            vec3 viewDir = normalize(vViewPosition);
            float fres = pow(1.0 - max(0.0, dot(viewDir, normal)), 3.0);
            outgoingLight += uRim * fres * 0.35;
          }
          #include <opaque_fragment>`,
        )
        .replace("#include <colorspace_fragment>", "gl_FragColor = sRGBTransferOETF( gl_FragColor );");
    };
    material.customProgramCacheKey = () =>
      `creature:${options.faceted === true}:${pattern ?? ""}:${swim ? `${swim.amp}/${swim.freq}/${swim.speed}/${swim.phase ?? 0}/${swim.from ?? 0.5}` : ""}:${flap ? `${flap.amp}/${flap.speed}/${flap.phase ?? 0}` : ""}`;
    return material;
  };

  return { caustic, creature };
}

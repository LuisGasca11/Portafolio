import { addAngelfish } from "./angelfish";
import { DEPTH } from "./context";
import type { SceneContext, Three, Updater } from "./context";
import { addFishSchools } from "./fish";
import { addJellyfish } from "./jellyfish";
import { addMantas } from "./manta";
import { addRays } from "./rays";
import { addSeabed } from "./seabed";
import { addSharks } from "./shark";
import { addSnow } from "./snow";
import { addSquids } from "./squid";
import { addTurtles } from "./turtle";
import { waterColors } from "./water";

/**
 * Arma la escena 3D del abismo sobre un canvas, la anima con el scroll y
 * devuelve la función que la desmonta. Lanza si WebGL no está disponible.
 */
export function startScene(THREE: Three, canvas: HTMLCanvasElement): () => void {
  const small = window.matchMedia("(max-width: 768px)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));

  const scene = new THREE.Scene();
  const fogColor = new THREE.Color();
  const sceneFog = new THREE.FogExp2(0x0a5a86, small ? 0.03 : 0.022);
  scene.fog = sceneFog;
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };
  const updaters: Updater[] = [];
  const time = { value: 0 };
  const ctx: SceneContext = {
    THREE,
    scene,
    small,
    track,
    time,
    pixel: { value: renderer.getPixelRatio() },
    fog: { uFog: { value: new THREE.Color() }, uFogDensity: { value: sceneFog.density } },
    updaters,
    flat: (color, emissive = 0x000000) => track(new THREE.MeshLambertMaterial({ color, flatShading: true, emissive, side: THREE.DoubleSide })),
    floorY: (wx, wz) => -DEPTH - 7 + Math.sin(wx * 0.25) * 0.8 + Math.cos((-22 - wz) * 0.3) * 0.7,
    pathAt: (cx, cz, radius, ang, out) => out.set(cx + Math.cos(ang) * radius, 0, cz + Math.sin(ang) * radius * 0.6),
  };

  // Fondo: degradado a pantalla completa que cambia con la profundidad.
  const bgUniforms = { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() } };
  const bg = new THREE.Mesh(
    track(new THREE.PlaneGeometry(2, 2)),
    track(
      new THREE.ShaderMaterial({
        uniforms: bgUniforms,
        depthTest: false,
        depthWrite: false,
        vertexShader: "varying float vY; void main(){ vY = position.y*0.5+0.5; gl_Position = vec4(position.xy, 0.999, 1.0); }",
        fragmentShader:
          "uniform vec3 uTop; uniform vec3 uBottom; varying float vY; void main(){ gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, vY)), 1.0); }",
      }),
    ),
  );
  bg.frustumCulled = false;
  bg.renderOrder = -1000;
  scene.add(bg);

  // Luces para las criaturas de relieve (el resto usa sombreado propio).
  scene.add(new THREE.AmbientLight(0x9fd8ff, 1.05));
  const sunLight = new THREE.DirectionalLight(0xe6f8ff, 1.5);
  sunLight.position.set(-6, 12, 8);
  scene.add(sunLight);

  // Capas de la escena, del fondo al frente.
  addSnow(ctx);
  addRays(ctx);
  const fishMaterial = addFishSchools(ctx);
  addAngelfish(ctx, fishMaterial);
  addJellyfish(ctx);
  addSeabed(ctx);
  addMantas(ctx);
  addTurtles(ctx);
  addSharks(ctx);
  addSquids(ctx);

  // Tamaño, scroll y puntero.
  let maxScroll = 1;
  let smooth = 0;
  let lastY = window.scrollY;
  let velocity = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    const hfov = (78 * Math.PI) / 180;
    const vfov = (2 * Math.atan(Math.tan(hfov / 2) / aspect) * 180) / Math.PI;
    camera.fov = Math.min(100, Math.max(50, vfov));
    camera.updateProjectionMatrix();
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resizeObserver.observe(document.body);
  window.addEventListener("resize", resize);
  const onPointer = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
  };
  if (fine) {
    window.addEventListener("pointermove", onPointer, { passive: true });
  }

  const clock = new THREE.Clock();
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    time.value = elapsed;

    const y = window.scrollY;
    velocity += ((y - lastY) / Math.max(dt, 0.001) / 2000 - velocity) * 0.2;
    lastY = y;
    const progress = Math.min(1, Math.max(0, y / maxScroll));
    smooth += (progress - smooth) * (1 - Math.exp(-dt * 4));

    const colors = waterColors(smooth);
    bgUniforms.uTop.value.setRGB(colors.top[0] ?? 0, colors.top[1] ?? 0, colors.top[2] ?? 0);
    bgUniforms.uBottom.value.setRGB(colors.bottom[0] ?? 0, colors.bottom[1] ?? 0, colors.bottom[2] ?? 0);
    fogColor.setRGB(
      ((colors.top[0] ?? 0) + (colors.bottom[0] ?? 0)) / 2,
      ((colors.top[1] ?? 0) + (colors.bottom[1] ?? 0)) / 2,
      ((colors.top[2] ?? 0) + (colors.bottom[2] ?? 0)) / 2,
    );
    ctx.fog.uFog.value.copy(fogColor);
    sceneFog.color.copy(fogColor);

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const pitch = -0.28 * Math.min(1, Math.max(0, (smooth - 0.86) / 0.14));
    camera.position.set(pointer.x * 1.4 + Math.sin(elapsed * 0.2) * 0.5, -smooth * DEPTH + Math.sin(elapsed * 0.3) * 0.3 - pointer.y * 0.5, 0);
    camera.rotation.set(pitch - pointer.y * 0.03, -pointer.x * 0.05, Math.max(-0.08, Math.min(0.08, -velocity * 0.02)));

    for (const update of updaters) {
      update(elapsed, dt, smooth);
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointer);
    for (const item of disposables) {
      item.dispose();
    }
    renderer.dispose();
    renderer.forceContextLoss();
  };
}

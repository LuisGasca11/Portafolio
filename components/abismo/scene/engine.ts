import { addAngelfish } from "./angelfish";
import { DEPTH } from "./context";
import type { SceneContext, Three, Updater } from "./context";
import { addFishSchools } from "./fish";
import { addJellyfish } from "./jellyfish";
import { addLandmarks } from "./landmarks";
import { addTrail } from "./trail";
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
  const stations = addLandmarks(ctx);
  const trail = addTrail(ctx);

  // Tamaño, scroll y puntero.
  let maxScroll = 1;
  let baseFov = 60;
  /** Parada de cada escenario: avance del scroll (0–1) y ancho del lanzamiento. */
  const stops = stations.map((station) => ({
    station,
    at: -1,
    width: 0.05,
    /** Ángulo de la órbita: del lado de la columna de agua. */
    angle: Math.atan2(-station.x, -station.z),
  }));
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
    baseFov = Math.min(100, Math.max(50, vfov));
    camera.fov = baseFov;
    camera.updateProjectionMatrix();
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    // El escenario de cada capítulo se coloca justo donde la cámara estará
    // cuando el texto del capítulo quede fijo en pantalla.
    for (const stop of stops) {
      const element = document.querySelector<HTMLElement>(`[data-chapter="${stop.station.id}"]`);
      if (!element) {
        stop.at = -1;
        stop.station.group.visible = false;
        continue;
      }
      const rect = element.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const pinned = Math.max(0, rect.height - window.innerHeight);
      stop.at = Math.min(1, (top + pinned * 0.55) / maxScroll);
      const { station } = stop;
      station.group.visible = true;
      station.group.position.y = station.onFloor ? ctx.floorY(station.x, station.z) : -stop.at * DEPTH - 1.6;
    }
    // Cada órbita dura hasta la mitad del camino al escenario vecino: la
    // cámara siempre va de uno al siguiente, sin tramos muertos.
    const active = stops.filter((stop) => stop.at >= 0);
    active.forEach((stop, index) => {
      const previousAt = active[index - 1]?.at ?? 0;
      const nextAt = active[index + 1]?.at;
      const gap = Math.min(stop.at - previousAt, nextAt === undefined ? stop.at - previousAt : nextAt - stop.at);
      stop.width = Math.max(0.02, gap * 0.49);
    });
    // Estela de plancton que une los escenarios: marca el camino del descenso.
    trail.build([
      new THREE.Vector3(0, 1, -5),
      ...active.map((stop) => {
        const { station } = stop;
        const reach = station.stand * 0.5;
        return new THREE.Vector3(
          station.x + Math.sin(stop.angle) * reach,
          station.group.position.y + (station.onFloor ? 3 : 0.5),
          station.z + Math.cos(stop.angle) * reach,
        );
      }),
    ]);
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

  let lastDive = -1;
  const basePosition = new THREE.Vector3();
  const baseEuler = new THREE.Euler();
  const baseQuat = new THREE.Quaternion();
  const orbit = new THREE.Vector3();
  const look = new THREE.Vector3();
  const lookMatrix = new THREE.Matrix4();
  const lookQuat = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const sway = new THREE.Vector3();
  // Resolución adaptable: si los cuadros tardan, baja la densidad de píxeles.
  const maxPixel = renderer.getPixelRatio();
  let pixel = maxPixel;
  let slowFrames = 0;
  let fastFrames = 0;
  const start = performance.now();
  let previous = start;
  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(Math.max(0, now - previous) / 1000, 0.05);
    previous = now;
    const elapsed = (now - start) / 1000;
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
    // Recorrido continuo: la cámara siempre desciende; al pasar por cada
    // escenario lo rodea en espiral mirándolo, y sigue hacia el siguiente.
    let dive = 0;
    let u = 0;
    let target: (typeof stops)[number] | undefined;
    for (const stop of stops) {
      if (stop.at < 0) continue;
      const local = (smooth - stop.at) / stop.width;
      if (Math.abs(local) >= 1) continue;
      const weight = (Math.cos(local * Math.PI) + 1) / 2;
      if (weight > dive) {
        dive = weight;
        u = local;
        target = stop;
      }
    }
    const ease = dive * dive * (3 - 2 * dive);
    sway.set(pointer.x * 1.2 + Math.sin(elapsed * 0.2) * 0.5, Math.sin(elapsed * 0.3) * 0.3 - pointer.y * 0.4, 0);
    const finalPitch = -0.28 * Math.min(1, Math.max(0, (smooth - 0.86) / 0.14));
    basePosition.set(0, -smooth * DEPTH, 0);
    baseEuler.set(finalPitch - pointer.y * 0.03, -pointer.x * 0.05, Math.max(-0.08, Math.min(0.08, -velocity * 0.02)));
    baseQuat.setFromEuler(baseEuler);
    if (target) {
      const { station } = target;
      const center = station.group.position;
      const theta = target.angle + u * (small ? 0.45 : 0.7);
      const lift = station.onFloor ? 6 - u * 1.5 : 1.8 - u * 3.2;
      orbit.set(center.x + Math.sin(theta) * station.stand, center.y + lift, center.z + Math.cos(theta) * station.stand);
      camera.position.lerpVectors(basePosition, orbit, ease).add(sway);
      // Encuadre: en escritorio el escenario queda a la derecha (el texto va a
      // la izquierda); en móvil, arriba (el texto va abajo).
      look.copy(center);
      if (small) {
        look.y -= 2.4;
      } else {
        look.x -= Math.cos(theta) * 3.6;
        look.z += Math.sin(theta) * 3.6;
        look.y -= station.onFloor ? 1 : 0.2;
      }
      lookMatrix.lookAt(camera.position, look, up);
      lookQuat.setFromRotationMatrix(lookMatrix);
      camera.quaternion.copy(baseQuat).slerp(lookQuat, ease);
    } else {
      camera.position.copy(basePosition).add(sway);
      camera.quaternion.copy(baseQuat);
    }
    const fov = baseFov * (1 - 0.08 * ease);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    if (Math.abs(ease - lastDive) > 0.004) {
      lastDive = ease;
      document.documentElement.style.setProperty("--ab-dive", ease.toFixed(3));
    }

    if (dt > 0.024) {
      slowFrames += 1;
      fastFrames = 0;
    } else if (dt < 0.015) {
      fastFrames += 1;
      slowFrames = Math.max(0, slowFrames - 1);
    }
    if (slowFrames > 45 && pixel > 1) {
      pixel = Math.max(1, pixel - 0.25);
      renderer.setPixelRatio(pixel);
      ctx.pixel.value = pixel;
      resize();
      slowFrames = 0;
    } else if (fastFrames > 240 && pixel < maxPixel) {
      pixel = Math.min(maxPixel, pixel + 0.25);
      renderer.setPixelRatio(pixel);
      ctx.pixel.value = pixel;
      resize();
      fastFrames = 0;
    }

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
    document.documentElement.style.removeProperty("--ab-dive");
    renderer.dispose();
    renderer.forceContextLoss();
  };
}

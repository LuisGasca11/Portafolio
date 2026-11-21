import { addAngelfish } from "./angelfish";
import { addBubbles } from "./bubbles";
import { DEPTH } from "./context";
import type { SceneContext, Three, Updater } from "./context";
import { addFishSchools } from "./fish";
import { addJellyfish } from "./jellyfish";
import { addMantas } from "./manta";
import { createWaterKit } from "./materials";
import { createUnderwaterPass } from "./post";
import { addRays } from "./rays";
import { addSeabed } from "./seabed";
import { addSharks } from "./shark";
import { addSnow } from "./snow";
import { addSquids } from "./squid";
import { addSurface } from "./surface";
import { addTurtles } from "./turtle";
import { waterColors } from "./water";

/**
 * Arma la escena 3D del abismo sobre un canvas, la anima con el scroll y
 * devuelve la función que la desmonta. Lanza si WebGL no está disponible.
 */
export function startScene(THREE: Three, canvas: HTMLCanvasElement): () => void {
  const small = window.matchMedia("(max-width: 768px)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  // Sin antialias del lienzo: el pase bajo el agua dibuja en un búfer con MSAA.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
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
  const kit = createWaterKit(THREE, time, track);
  const post = createUnderwaterPass(THREE, renderer, small);
  const ctx: SceneContext = {
    THREE,
    scene,
    small,
    track,
    time,
    pixel: { value: renderer.getPixelRatio() },
    fog: { uFog: { value: new THREE.Color() }, uFogDensity: { value: sceneFog.density } },
    updaters,
    creature: kit.creature,
    caustic: kit.caustic,
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

  // Luz del agua: cielo cian arriba, rebote oscuro abajo y el sol filtrado.
  // Al bajar, la luz del sol se apaga y se enciende el faro de la cámara.
  const hemi = new THREE.HemisphereLight(0xb8f0ff, 0x0a2433, 1.6);
  scene.add(hemi);
  const ambient = new THREE.AmbientLight(0x8fd0f0, 0.35);
  scene.add(ambient);
  const sunLight = new THREE.DirectionalLight(0xe6f8ff, 2.2);
  sunLight.position.set(-6, 12, 8);
  scene.add(sunLight);
  const headlamp = new THREE.PointLight(0xbff3ff, 0, 38, 1.1);
  headlamp.position.set(0, 1.5, 1);
  camera.add(headlamp);
  scene.add(camera);

  // Capas de la escena, del fondo al frente.
  addSnow(ctx);
  addRays(ctx);
  addSurface(ctx);
  addFishSchools(ctx);
  addAngelfish(ctx);
  addJellyfish(ctx);
  addSeabed(ctx);
  addMantas(ctx);
  addTurtles(ctx);
  addSharks(ctx);
  addSquids(ctx);
  addBubbles(ctx, camera);

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
    post.setSize(w, h, renderer.getPixelRatio());
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

  // Resolución adaptable: si los cuadros tardan, baja la densidad de píxeles.
  const maxPixel = renderer.getPixelRatio();
  let pixel = maxPixel;
  let slowFrames = 0;
  let fastFrames = 0;
  const setPixel = (value: number) => {
    pixel = value;
    renderer.setPixelRatio(pixel);
    ctx.pixel.value = pixel;
    resize();
  };
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
    const pitch = -0.28 * Math.min(1, Math.max(0, (smooth - 0.86) / 0.14));
    camera.position.set(pointer.x * 1.4 + Math.sin(elapsed * 0.2) * 0.5, -smooth * DEPTH + Math.sin(elapsed * 0.3) * 0.3 - pointer.y * 0.5, 0);
    camera.rotation.set(pitch - pointer.y * 0.03, -pointer.x * 0.05, Math.max(-0.08, Math.min(0.08, -velocity * 0.02)));

    // La luz cambia con la profundidad.
    kit.caustic.value = Math.max(0, 1 - smooth * 2.4);
    sunLight.intensity = 2.2 * Math.max(0.05, 1 - smooth * 1.6);
    hemi.intensity = 0.5 + 1.1 * Math.max(0, 1 - smooth * 1.2);
    headlamp.intensity = 40 * Math.min(1, Math.max(0, (smooth - 0.25) / 0.35));

    if (dt > 0.024) {
      slowFrames += 1;
      fastFrames = 0;
    } else if (dt < 0.015) {
      fastFrames += 1;
      slowFrames = Math.max(0, slowFrames - 1);
    }
    if (slowFrames > 45 && pixel > 1) {
      setPixel(Math.max(1, pixel - 0.25));
      slowFrames = 0;
    } else if (fastFrames > 240 && pixel < maxPixel) {
      setPixel(Math.min(maxPixel, pixel + 0.25));
      fastFrames = 0;
    }

    for (const update of updaters) {
      update(elapsed, dt, smooth);
    }
    post.render(scene, camera, elapsed, smooth);
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
    post.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}

"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const vertexSource = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const fragmentSource = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_day;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec2 amberPoint = vec2(0.22 + 0.12 * sin(t * 0.22), 0.5 + 0.08 * cos(t * 0.18));
  vec2 bluePoint = vec2(0.78 + 0.08 * cos(t * 0.16), 0.42 + 0.12 * sin(t * 0.2));
  float amberDistance = length(uv - amberPoint);
  float blueDistance = length(uv - bluePoint);
  // El cielo recorre el día con el scroll: mañana azul -> atardecer naranja -> noche.
  vec3 dayInk = vec3(0.10, 0.17, 0.26);
  vec3 dayAmber = vec3(0.85, 0.55, 0.25);
  vec3 dayBlue = vec3(0.25, 0.55, 0.85);
  vec3 duskInk = vec3(0.16, 0.08, 0.05);
  vec3 duskAmber = vec3(0.95, 0.45, 0.10);
  vec3 duskBlue = vec3(0.35, 0.16, 0.45);
  vec3 nightInk = vec3(0.027, 0.031, 0.04);
  vec3 nightAmber = vec3(0.64, 0.32, 0.1);
  vec3 nightBlue = vec3(0.07, 0.24, 0.58);
  float duskMix = smoothstep(0.0, 0.55, u_day);
  float nightMix = smoothstep(0.55, 1.0, u_day);
  vec3 ink = mix(mix(dayInk, duskInk, duskMix), nightInk, nightMix);
  vec3 amber = mix(mix(dayAmber, duskAmber, duskMix), nightAmber, nightMix);
  vec3 blue = mix(mix(dayBlue, duskBlue, duskMix), nightBlue, nightMix);
  vec3 color = ink;
  color = mix(color, amber, smoothstep(0.78, 0.0, amberDistance));
  color = mix(color, blue, smoothstep(0.82, 0.02, blueDistance) * 0.9);
  float vignette = smoothstep(1.2, 0.28, length((uv - 0.5) * vec2(1.2, 1.0)));
  color *= vignette;
  float grain = fract(sin(dot(gl_FragCoord.xy + t * 40.0, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.045;
  float spark = step(0.9975, fract(sin(dot(floor(uv * u_res * 0.45), vec2(23.1, 91.7))) * 43758.5));
  color += spark * 0.28 * nightMix;
  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!context) {
      return;
    }
    const surface = canvas;
    const gl = context;

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_res");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const dayLocation = gl.getUniformLocation(program, "u_day");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Progreso del día ligado al scroll de toda la página: 0 = mañana en el
    // hero, 1 = noche al final del recorrido. Con movimiento reducido se queda
    // en la escena nocturna original.
    const dayState = { value: reduce ? 1 : 0 };
    let dayTween: gsap.core.Tween | null = null;
    if (!reduce) {
      dayTween = gsap.to(dayState, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "max",
          scrub: 0.6,
        },
      });
    }
    let frame = 0;
    let visible = true;
    const started = performance.now();

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
      const width = Math.max(1, Math.floor(surface.clientWidth * ratio));
      const height = Math.max(1, Math.floor(surface.clientHeight * ratio));
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
      }
      gl.viewport(0, 0, surface.width, surface.height);
      gl.uniform2f(resolutionLocation, surface.width, surface.height);
    }

    function draw(now: number) {
      gl.uniform1f(timeLocation, reduce ? 0 : (now - started) / 1000);
      if (dayLocation) {
        gl.uniform1f(dayLocation, dayState.value);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function loop(now: number) {
      if (visible && !document.hidden) {
        draw(now);
      }
      frame = requestAnimationFrame(loop);
    }

    resize();
    draw(started);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);

    if (!reduce) {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      dayTween?.scrollTrigger?.kill();
      dayTween?.kill();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

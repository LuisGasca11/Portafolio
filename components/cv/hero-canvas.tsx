"use client";

import { useEffect, useRef } from "react";

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
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec2 emberPoint = vec2(-0.02 + 0.08 * sin(t * 0.22), 0.82 + 0.06 * cos(t * 0.18));
  vec2 flamePoint = vec2(1.05 + 0.06 * cos(t * 0.16), 0.08 + 0.08 * sin(t * 0.2));
  float emberDistance = length(uv - emberPoint);
  float flameDistance = length(uv - flamePoint);
  vec3 ink = vec3(0.035, 0.02, 0.012);
  vec3 ember = vec3(0.78, 0.24, 0.02);
  vec3 flame = vec3(1.0, 0.42, 0.05);
  vec3 color = ink;
  color = mix(color, ember, smoothstep(0.95, 0.02, emberDistance));
  color = mix(color, flame, smoothstep(0.88, 0.0, flameDistance) * 0.9);
  float center = smoothstep(0.72, 0.08, length((uv - vec2(0.5, 0.46)) * vec2(1.05, 0.9)));
  color = mix(color, ink, center * 0.8);
  float grain = fract(sin(dot(gl_FragCoord.xy + t * 40.0, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.04;
  float spark = step(0.9978, fract(sin(dot(floor(uv * u_res * 0.45), vec2(23.1, 91.7))) * 43758.5));
  color += spark * vec3(1.0, 0.62, 0.28);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="hero-canvas absolute inset-0 h-full w-full" aria-hidden="true" />
  );
}

/* Escenas procedurales para los videos ambientales de la portada.
 * Cada escena es una función pura de t en [0, 1): todo se mueve con ciclos
 * enteros, así el video queda en bucle perfecto. */
const W = 960;
const H = 540;
const TAU = Math.PI * 2;

function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const canvas = document.getElementById("c");
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext("2d");

/* ------------------------------ OCÉANO ------------------------------ */
const causticCanvas = document.createElement("canvas");
const CW = 256;
const CH = 144;
causticCanvas.width = CW;
causticCanvas.height = CH;
const cctx = causticCanvas.getContext("2d");
const oceanRand = rng(11);
const snow = Array.from({ length: 110 }, () => ({
  x: oceanRand(), y: oceanRand(), r: 0.6 + oceanRand() * 1.8, a: 0.2 + oceanRand() * 0.5,
  cyc: oceanRand() > 0.5 ? 2 : 1, k: 1 + Math.floor(oceanRand() * 2), ph: oceanRand(),
}));

function ocean(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#3ccfe0");
  g.addColorStop(0.32, "#0f8cb6");
  g.addColorStop(0.72, "#0a4f78");
  g.addColorStop(1, "#06304d");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const img = cctx.createImageData(CW, CH);
  const ks = [-2, -1, 1, 2, -1];
  const inten = 0.005;
  for (let y = 0; y < CH; y += 1) {
    const fall = 1 - (y / CH) * 0.8;
    for (let x = 0; x < CW; x += 1) {
      const px = (x / CW) * 1.7778 * TAU * 1.5 - 250;
      const py = (y / CH) * TAU * 1.5 - 250;
      let ix = px;
      let iy = py;
      let c = 1;
      for (let n = 0; n < 5; n += 1) {
        const tn = t * TAU * ks[n] + 23;
        ix = px + Math.cos(tn - ix) + Math.sin(tn + iy);
        iy = py + Math.sin(tn - iy) + Math.cos(tn + ix);
        c += 1 / Math.hypot(px / (Math.sin(ix + tn) / inten), py / (Math.cos(iy + tn) / inten));
      }
      c /= 5;
      c = 1.17 - Math.pow(c, 1.4);
      const v = Math.min(1, Math.pow(Math.abs(c), 8));
      const i = (y * CW + x) * 4;
      img.data[i] = 170;
      img.data[i + 1] = 245;
      img.data[i + 2] = 255;
      img.data[i + 3] = Math.min(255, v * 255 * 0.6 * fall);
    }
  }
  cctx.putImageData(img, 0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = "blur(1.2px)";
  ctx.drawImage(causticCanvas, 0, 0, W, H);
  ctx.restore();

  for (let i = 0; i < 6; i += 1) {
    const x0 = 60 + i * 165;
    const a = 0.55 + 0.45 * Math.sin(TAU * (t + i / 6));
    const sg = ctx.createLinearGradient(x0, 0, x0 - 200, H);
    sg.addColorStop(0, `rgba(210,250,255,${0.2 * a})`);
    sg.addColorStop(1, "rgba(210,250,255,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + 70, 0);
    ctx.lineTo(x0 - 130, H);
    ctx.lineTo(x0 - 270, H);
    ctx.closePath();
    ctx.fill();
  }

  for (const p of snow) {
    const y = (((p.y - t * p.cyc * 0.25) % 1) + 1) % 1;
    const x = p.x * W + Math.sin(TAU * (t * p.k + p.ph)) * 14;
    ctx.fillStyle = `rgba(220,248,255,${p.a})`;
    ctx.beginPath();
    ctx.arc(x, y * H, p.r, 0, TAU);
    ctx.fill();
  }

  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(2,16,32,0)");
  v.addColorStop(1, "rgba(2,16,32,0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

const scenes = { ocean };
window.renderFrame = (name, t) => {
  ctx.clearRect(0, 0, W, H);
  scenes[name](t);
  return canvas.toDataURL("image/png");
};

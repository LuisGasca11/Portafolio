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

/* ------------------------- PAPEL PICADO Y PÉTALOS ------------------------- */
const flagColors = ["#e6007e", "#00b8a9", "#ffc400", "#7a2cbf", "#ff6a00"];
function makeFlag(color) {
  const c = document.createElement("canvas");
  c.width = 120;
  c.height = 150;
  const x = c.getContext("2d");
  const fw = 96;
  const fh = 118;
  const ox = 12;
  x.fillStyle = color;
  x.beginPath();
  x.moveTo(ox, 6);
  x.lineTo(ox + fw, 6);
  x.lineTo(ox + fw, 6 + fh - 14);
  for (let i = 0; i < 8; i += 1) {
    x.lineTo(ox + fw - (i + 0.5) * (fw / 8), 6 + fh);
    x.lineTo(ox + fw - (i + 1) * (fw / 8), 6 + fh - 14);
  }
  x.closePath();
  x.fill();
  x.globalCompositeOperation = "destination-out";
  x.lineWidth = 6;
  x.beginPath();
  x.arc(ox + fw / 2, 6 + 52, 24, 0, TAU);
  x.stroke();
  x.beginPath();
  x.arc(ox + fw / 2, 6 + 52, 8, 0, TAU);
  x.fill();
  for (let i = 0; i < 6; i += 1) {
    const dx = ox + 14 + i * 14.5;
    for (const dy of [22, 96]) {
      x.beginPath();
      x.moveTo(dx, 6 + dy - 7);
      x.lineTo(dx + 5, 6 + dy);
      x.lineTo(dx, 6 + dy + 7);
      x.lineTo(dx - 5, 6 + dy);
      x.closePath();
      x.fill();
    }
  }
  return c;
}
let flags = null;
const petalRand = rng(5);
const petalColors = ["#ff8c00", "#ffb000", "#ffc93c", "#e6007e", "#ff5e3a", "#ffd966"];
const petals = Array.from({ length: 52 }, () => ({
  x: petalRand(), y: petalRand(), s: 0.55 + petalRand() * 1.1, cyc: petalRand() > 0.5 ? 2 : 1,
  k: 1 + Math.floor(petalRand() * 2), ph: petalRand(), r: [1, -1, 2][Math.floor(petalRand() * 3)],
  m: 1 + Math.floor(petalRand() * 2), col: petalColors[Math.floor(petalRand() * petalColors.length)],
  blur: petalRand() > 0.8,
}));

function petal(x, y, rot, sx, sy, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(sx, sy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.bezierCurveTo(14, -10, 12, 12, 0, 18);
  ctx.bezierCurveTo(-12, 12, -14, -10, 0, -16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(0, 12);
  ctx.stroke();
  ctx.restore();
}

function petals_(t) {
  if (flags === null) {
    flags = flagColors.map(makeFlag);
  }
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#ff6f61");
  g.addColorStop(0.55, "#ffb25b");
  g.addColorStop(1, "#ffe3a3");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  for (const line of [{ y: 18, sag: 34, n: 11, off: 0 }, { y: 112, sag: 22, n: 9, off: 0.5 }]) {
    ctx.strokeStyle = "rgba(90,20,40,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = -10; x <= W + 10; x += 10) {
      const u = (x - W / 2) / (W / 2);
      const yy = line.y + line.sag * (1 - u * u);
      if (x === -10) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
    for (let i = 0; i < line.n; i += 1) {
      const x = ((i + 0.5) / line.n) * W;
      const u = (x - W / 2) / (W / 2);
      const yy = line.y + line.sag * (1 - u * u);
      const sway = Math.sin(TAU * (t + i * 0.13 + line.off)) * 0.09;
      const sprite = flags[(i + Math.round(line.off * 2)) % flags.length];
      ctx.save();
      ctx.translate(x, yy);
      ctx.rotate(sway);
      ctx.shadowColor = "rgba(70,10,30,0.35)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 5;
      ctx.drawImage(sprite, -48, -5, 96, 120);
      ctx.restore();
    }
  }

  for (const p of petals) {
    const y = (((p.y + t * p.cyc) % 1) * (H + 80)) - 40;
    const x = p.x * W + Math.sin(TAU * (t * p.k + p.ph)) * 42;
    const rot = TAU * (t * p.r + p.ph);
    const flutter = 0.55 + 0.45 * Math.abs(Math.cos(TAU * (t * p.m + p.ph)));
    ctx.save();
    ctx.shadowColor = "rgba(110,30,0,0.3)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 5;
    if (p.blur) ctx.filter = "blur(2.5px)";
    petal(x, y, rot, p.s * flutter, p.s, p.col);
    ctx.restore();
  }
}

/* ---------------------------- JARDÍN DORADO ---------------------------- */
const gardenRand = rng(23);
const bokeh = Array.from({ length: 26 }, () => ({
  x: gardenRand(), y: gardenRand(), r: 16 + gardenRand() * 54, a: 0.05 + gardenRand() * 0.1,
  col: gardenRand() > 0.4 ? "255,214,120" : "150,230,150", ph: gardenRand(), k: 1 + Math.floor(gardenRand() * 2),
}));
const flies = Array.from({ length: 40 }, () => ({
  x: 0.05 + gardenRand() * 0.9, y: 0.12 + gardenRand() * 0.8, ax: 20 + gardenRand() * 60, ay: 14 + gardenRand() * 40,
  k: 1 + Math.floor(gardenRand() * 2), m: 1 + Math.floor(gardenRand() * 2), ph: gardenRand(), ph2: gardenRand(),
  p: 1 + Math.floor(gardenRand() * 3), r: 5 + gardenRand() * 9,
}));
const pollen = Array.from({ length: 70 }, () => ({
  x: gardenRand(), y: gardenRand(), r: 0.5 + gardenRand() * 1.3, cyc: gardenRand() > 0.5 ? 2 : 1, k: 1 + Math.floor(gardenRand() * 2),
  ph: gardenRand(), a: 0.3 + gardenRand() * 0.5,
}));
const leaves = [
  [-20, 80, 0.5, 1.5], [-10, 200, 0.2, 1.3], [-30, 330, -0.2, 1.7], [-10, 470, -0.5, 1.4],
  [980, 60, 2.6, 1.5], [970, 190, 2.9, 1.3], [990, 340, 3.3, 1.7], [975, 480, 3.6, 1.4],
  [200, -20, 1.5, 1.2], [480, -30, 1.7, 1.5], [760, -20, 1.4, 1.2],
  [120, 570, -1.4, 1.3], [520, 580, -1.6, 1.6], [860, 570, -1.7, 1.3],
];

function leaf(x, y, rot, s, t, i) {
  const sway = Math.sin(TAU * (t + i * 0.11)) * 0.06;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot + sway);
  ctx.scale(s * 0.55, s * 0.55);
  const g = ctx.createLinearGradient(0, 0, 220, 0);
  g.addColorStop(0, "#04120b");
  g.addColorStop(1, "#0d3a24");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(60, -70, 170, -60, 230, 0);
  ctx.bezierCurveTo(170, 60, 60, 70, 0, 0);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,226,150,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(220, 0);
  ctx.stroke();
  ctx.restore();
}

function garden(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0a2418");
  g.addColorStop(1, "#164330");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(120, -40, 20, 120, -40, 640);
  glow.addColorStop(0, "rgba(255,210,122,0.42)");
  glow.addColorStop(1, "rgba(255,210,122,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 5; i += 1) {
    const x0 = 30 + i * 120;
    const a = 0.55 + 0.45 * Math.sin(TAU * (t + i / 5));
    const sg = ctx.createLinearGradient(x0, 0, x0 + 280, H);
    sg.addColorStop(0, `rgba(255,226,160,${0.24 * a})`);
    sg.addColorStop(1, "rgba(255,226,160,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + 60, 0);
    ctx.lineTo(x0 + 420, H);
    ctx.lineTo(x0 + 250, H);
    ctx.closePath();
    ctx.fill();
  }

  for (const b of bokeh) {
    const x = b.x * W + Math.sin(TAU * (t * b.k + b.ph)) * 26;
    const y = b.y * H + Math.cos(TAU * (t * b.k + b.ph)) * 18;
    ctx.fillStyle = `rgba(${b.col},${b.a})`;
    ctx.beginPath();
    ctx.arc(x, y, b.r, 0, TAU);
    ctx.fill();
  }

  for (const p of pollen) {
    const y = (((p.y - t * p.cyc * 0.3) % 1) + 1) % 1;
    const x = p.x * W + Math.sin(TAU * (t * p.k + p.ph)) * 16;
    ctx.fillStyle = `rgba(255,236,170,${p.a})`;
    ctx.beginPath();
    ctx.arc(x, y * H, p.r, 0, TAU);
    ctx.fill();
  }

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const f of flies) {
    const x = f.x * W + Math.sin(TAU * (t * f.k + f.ph)) * f.ax;
    const y = f.y * H + Math.cos(TAU * (t * f.m + f.ph2)) * f.ay;
    const pulse = 0.3 + 0.7 * Math.pow(Math.sin(TAU * (t * f.p + f.ph)) * 0.5 + 0.5, 2);
    const rg = ctx.createRadialGradient(x, y, 0, x, y, f.r * 2.6);
    rg.addColorStop(0, `rgba(255,240,150,${0.95 * pulse})`);
    rg.addColorStop(0.25, `rgba(255,214,90,${0.5 * pulse})`);
    rg.addColorStop(1, "rgba(255,214,90,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, f.r * 2.6, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  leaves.forEach((l, i) => {
    leaf(l[0], l[1], l[2], l[3], t, i);
  });

  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H);
  v.addColorStop(0, "rgba(3,14,8,0)");
  v.addColorStop(1, "rgba(3,14,8,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

const scenes = { ocean, petals: petals_, garden };
window.renderFrame = (name, t) => {
  ctx.clearRect(0, 0, W, H);
  scenes[name](t);
  return canvas.toDataURL("image/png");
};

/* Renderiza los bucles de video de la portada.
 * Uso: node tools/render-loops/render.cjs [ocean|petals|garden|all] [--test]
 * Requiere Playwright (Chromium) y ffmpeg. Salida: public/worlds/ */
const { chromium } = require("playwright");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "public/worlds");
const tmp = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "loops-"));
const FPS = 24;
const SECONDS = 5;
const names = { ocean: "abismo", petals: "papel", garden: "jardin" };

(async () => {
  const arg = process.argv[2] ?? "all";
  const test = process.argv.includes("--test");
  const list = arg === "all" ? Object.keys(names) : [arg];
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  await page.goto("file://" + path.join(__dirname, "index.html"));
  for (const scene of list) {
    const frames = test ? 1 : FPS * SECONDS;
    const dir = path.join(tmp, scene);
    fs.mkdirSync(dir);
    for (let i = 0; i < frames; i += 1) {
      const url = await page.evaluate(([n, t]) => window.renderFrame(n, t), [scene, i / frames]);
      fs.writeFileSync(path.join(dir, `f${String(i).padStart(4, "0")}.png`), Buffer.from(url.split(",")[1], "base64"));
    }
    const base = path.join(outDir, names[scene]);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(dir, "f0000.png"), "-q:v", "4", base + "-poster.jpg"]);
    if (!test) {
      const input = ["-framerate", String(FPS), "-i", path.join(dir, "f%04d.png")];
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...input, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-pix_fmt", "yuv420p", "-an", base + ".webm"]);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...input, "-c:v", "libx264", "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", base + ".mp4"]);
    }
    console.log("listo", scene);
  }
  await browser.close();
})();

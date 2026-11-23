// Builds the six case-study images (hero, card, banner, feature, gallery-1, gallery-2) as device mockups
// from screenshots made by capture.mjs. Usage: node scripts/mockups/compose.mjs <config.json>
//
// Config shape:
// {
//   "shots": "work/smiles/shots", "out": "work/smiles/out", "slug": "smiles-by-sethna",
//   "palette": { "stops": ["#eaf0ff", "#8fb0ff", "#1d4dff"], "accent": "#ffd23f" },
//   "desktop": { "hero": "desktop-s00.png", "sections": ["desktop-s01.png", ...9 files] },
//   "mobile":  { "a": "mobile-s00.png", "b": "...", "c": "...", "d": "...", "e": "..." },
//   "tablet":  "tablet-top.png"
// }
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [configPath] = process.argv.slice(2);
if (!configPath) {
  console.error("Usage: node scripts/mockups/compose.mjs <config.json>");
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(configPath, "utf8").replace(/^﻿/, ""));
const shots = resolve(cfg.shots);
const out = resolve(cfg.out);
mkdirSync(out, { recursive: true });
const src = (file) => pathToFileURL(join(shots, file)).href;
const { stops, accent } = cfg.palette;

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow: hidden; }
.stage { position: relative; overflow: hidden; background: linear-gradient(var(--angle, 135deg), ${stops[0]} 0%, ${stops[1]} 52%, ${stops[2]} 100%); }
.blob { position: absolute; border-radius: 50%; filter: blur(2px); opacity: .9; }
.abs { position: absolute; }
.laptop { position: absolute; }
.laptop .screen { background: #0d0e12; border-radius: 26px 26px 6px 6px; padding: 16px 16px 14px; box-shadow: 0 50px 90px -30px rgba(8, 20, 70, .55), 0 18px 30px -12px rgba(8, 20, 70, .35); }
.laptop .screen::before { content: ""; position: absolute; top: 5px; left: 50%; width: 7px; height: 7px; margin-left: -3px; border-radius: 50%; background: #2a2c34; }
.laptop .screen img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; border-radius: 8px; }
.laptop .base { height: 24px; width: 112%; margin-left: -6%; border-radius: 4px 4px 30px 30px; background: linear-gradient(#e3e6ec, #b4bac6); box-shadow: 0 20px 30px -14px rgba(8, 20, 70, .45); position: relative; }
.laptop .base::after { content: ""; position: absolute; top: 0; left: 50%; width: 16%; height: 8px; margin-left: -8%; border-radius: 0 0 14px 14px; background: #9ba2b0; }
.phone { position: absolute; background: #0d0e12; border-radius: calc(var(--w) * 0.14); padding: calc(var(--w) * 0.028); box-shadow: 0 50px 80px -28px rgba(8, 20, 70, .6), 0 16px 26px -10px rgba(8, 20, 70, .35); }
.phone::before { content: ""; position: absolute; z-index: 2; top: 1.9%; left: 50%; width: 26%; height: 2.2%; margin-left: -13%; border-radius: 99px; background: #0d0e12; }
.phone img { display: block; width: 100%; aspect-ratio: 390 / 844; object-fit: cover; object-position: top; border-radius: calc(var(--w) * 0.115); }
.tablet { position: absolute; background: #0d0e12; border-radius: calc(var(--w) * 0.055); padding: calc(var(--w) * 0.022); box-shadow: 0 50px 80px -28px rgba(8, 20, 70, .6), 0 16px 26px -10px rgba(8, 20, 70, .35); }
.tablet img { display: block; width: 100%; aspect-ratio: 820 / 1180; object-fit: cover; object-position: top; border-radius: calc(var(--w) * 0.034); }
.card { position: absolute; overflow: hidden; border-radius: 22px; background: #fff; box-shadow: 0 30px 50px -22px rgba(8, 20, 70, .5), 0 8px 16px -8px rgba(8, 20, 70, .25); }
.card img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
`;

const laptop = (file, { left, top, width }) =>
  `<div class="laptop" style="left:${left}px;top:${top}px;width:${width}px"><div class="screen"><img src="${src(file)}"></div><div class="base"></div></div>`;
const phone = (file, { left, top, width, rotate = 0, z = 1 }) =>
  `<div class="phone" style="--w:${width}px;left:${left}px;top:${top}px;width:${width}px;transform:rotate(${rotate}deg);z-index:${z}"><img src="${src(file)}"></div>`;
const tablet = (file, { left, top, width, rotate = 0, z = 1 }) =>
  `<div class="tablet" style="--w:${width}px;left:${left}px;top:${top}px;width:${width}px;transform:rotate(${rotate}deg);z-index:${z}"><img src="${src(file)}"></div>`;
const card = (file, { left, top, width, height, rotate = 0, z = 1 }) =>
  `<div class="card" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px;transform:rotate(${rotate}deg);z-index:${z}"><img src="${src(file)}"></div>`;
const blob = (size, left, top, color) =>
  `<div class="blob" style="width:${size}px;height:${size}px;left:${left}px;top:${top}px;background:${color}"></div>`;

const d = cfg.desktop;
const m = cfg.mobile;
const sec = d.sections;

const images = [
  {
    name: "hero",
    w: 1920,
    h: 1080,
    html: [
      blob(520, 1480, -180, accent),
      blob(300, -90, 760, "rgba(255,255,255,.55)"),
      laptop(d.hero, { left: 270, top: 120, width: 1260 }),
      phone(m.a, { left: 1380, top: 470, width: 290, rotate: 3, z: 3 }),
    ],
  },
  {
    name: "card",
    w: 1200,
    h: 900,
    html: [
      blob(360, 820, -120, accent),
      laptop(d.hero, { left: 150, top: 170, width: 860 }),
      phone(m.a, { left: 880, top: 430, width: 200, rotate: 3, z: 3 }),
    ],
  },
  {
    name: "banner",
    w: 1920,
    h: 620,
    angle: "100deg",
    html: [
      blob(380, 1540, -170, accent),
      card(sec[0], { left: 60, top: 190, width: 440, height: 275, rotate: -2 }),
      card(sec[1], { left: 520, top: 110, width: 440, height: 275, rotate: 1.5, z: 2 }),
      card(sec[2], { left: 960, top: 230, width: 440, height: 275, rotate: -1.5 }),
      card(sec[3], { left: 1420, top: 120, width: 440, height: 275, rotate: 2, z: 2 }),
    ],
  },
  {
    name: "feature",
    w: 1920,
    h: 1080,
    angle: "160deg",
    html: [
      blob(480, -140, -150, accent),
      phone(m.b, { left: 330, top: 190, width: 400, rotate: -4 }),
      phone(m.c, { left: 760, top: 70, width: 440, z: 3 }),
      phone(m.d, { left: 1230, top: 190, width: 400, rotate: 4 }),
    ],
  },
  {
    name: "gallery-1",
    w: 1920,
    h: 1080,
    angle: "120deg",
    html: [
      `<div class="abs" style="left:-300px;top:-240px;width:2600px;height:1700px;transform:rotate(-9deg)">`,
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) =>
        card(sec[i], { left: 90 + (i % 3) * 760, top: 60 + Math.floor(i / 3) * 480, width: 700, height: 440 }),
      ),
      `</div>`,
    ],
  },
  {
    name: "gallery-2",
    w: 1920,
    h: 1080,
    angle: "200deg",
    html: [
      blob(520, 1500, 620, accent),
      tablet(cfg.tablet, { left: 200, top: 120, width: 640, rotate: -3, z: 2 }),
      phone(m.d, { left: 930, top: 200, width: 330, rotate: 0, z: 3 }),
      phone(m.e, { left: 1330, top: 90, width: 330, rotate: 3, z: 2 }),
    ],
  },
];

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
for (const img of images) {
  const page = await browser.newPage({ viewport: { width: img.w, height: img.h }, deviceScaleFactor: 1 });
  const htmlPath = join(out, `${img.name}.html`);
  writeFileSync(
    htmlPath,
    `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="stage" style="width:${img.w}px;height:${img.h}px;--angle:${img.angle ?? "135deg"}">${img.html.join("")}</div></body></html>`,
  );
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
  await page.waitForTimeout(400);
  const png = join(out, `${cfg.slug}-${img.name}.png`);
  await page.screenshot({ path: png });
  await sharp(png).webp({ quality: 86 }).toFile(join(out, `${cfg.slug}-${img.name}.webp`));
  await page.close();
  console.log("rendered", img.name);
}
await browser.close();

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Crop image assets out of Figma frame renders.
 * Manifest entries: { frame, x, y, w, h, out, format? } in 1x pixel space.
 * @returns {Promise<{written: string[]; failed: {out: string; reason: string}[]}>}
 */
export async function cropAll(manifestPath, renderDir, outDir) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const written = [];
  const failed = [];
  const sizes = new Map();

  for (const entry of manifest) {
    const { frame, x, y, w, h, out } = entry;
    const box = `${x},${y},${w},${h}`;
    try {
      const file = path.join(renderDir, `${frame}.png`);
      if (!sizes.has(frame)) {
        const meta = await sharp(file).metadata();
        sizes.set(frame, { width: meta.width, height: meta.height });
      }
      const size = sizes.get(frame);
      if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > size.width || y + h > size.height) {
        failed.push({
          out,
          reason: `crop box ${box} is outside ${frame} (${size.width}x${size.height})`,
        });
        continue;
      }
      const target = path.join(outDir, out);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      let img = sharp(file).extract({ left: x, top: y, width: w, height: h });
      const format = entry.format ?? path.extname(out).slice(1);
      if (format === "webp") img = img.webp({ quality: 90 });
      else if (format === "jpg" || format === "jpeg") img = img.jpeg({ quality: 90 });
      else img = img.png();
      await img.toFile(target);
      written.push(out);
    } catch (error) {
      failed.push({ out, reason: `crop box ${box}: ${error.message}` });
    }
  }
  return { written, failed };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const result = await cropAll(
    path.join(root, "scripts/assets.manifest.json"),
    path.join(root, "design/figma-renders"),
    path.join(root, "public/images"),
  );
  console.log(`written ${result.written.length}, failed ${result.failed.length}`);
  for (const f of result.failed) console.error(`FAILED ${f.out}: ${f.reason}`);
  if (result.failed.length) process.exit(1);
}

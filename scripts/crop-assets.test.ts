import { describe, expect, it } from "vitest";
import sharp from "sharp";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { cropAll } from "./crop-assets.mjs";

async function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "crop-"));
  const renders = path.join(dir, "renders");
  fs.mkdirSync(renders);
  await sharp({ create: { width: 100, height: 100, channels: 3, background: "#2e5bff" } })
    .png()
    .toFile(path.join(renders, "frame.png"));
  const manifest = path.join(dir, "manifest.json");
  fs.writeFileSync(
    manifest,
    JSON.stringify([
      { frame: "frame", x: 10, y: 10, w: 40, h: 30, out: "group/ok.png" },
      { frame: "frame", x: 80, y: 80, w: 40, h: 40, out: "group/bad.png" },
    ]),
  );
  return { dir, renders, manifest, out: path.join(dir, "out") };
}

describe("cropAll", () => {
  it("writes valid crops at the requested size", async () => {
    const f = await fixture();
    const result = await cropAll(f.manifest, f.renders, f.out);
    expect(result.written).toEqual(["group/ok.png"]);
    const meta = await sharp(path.join(f.out, "group/ok.png")).metadata();
    expect([meta.width, meta.height]).toEqual([40, 30]);
  });

  it("reports a crop box outside the frame as failed with the box in the reason", async () => {
    const f = await fixture();
    const result = await cropAll(f.manifest, f.renders, f.out);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].out).toBe("group/bad.png");
    expect(result.failed[0].reason).toMatch(/80,80,40,40/);
    expect(fs.existsSync(path.join(f.out, "group/bad.png"))).toBe(false);
  });
});

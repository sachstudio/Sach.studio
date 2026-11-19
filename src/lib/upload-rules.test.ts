import { describe, expect, it } from "vitest";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, validateUpload } from "./upload-rules";

const MB = 1024 * 1024;

describe("validateUpload", () => {
  it("accepts PNG, JPG, WebP, SVG and AVIF images", () => {
    for (const type of ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"]) {
      expect(validateUpload({ type, size: 2 * MB }), type).toEqual({ ok: true });
    }
    expect(ALLOWED_IMAGE_TYPES).toHaveLength(5);
  });

  it("rejects a PDF and says which types are allowed", () => {
    expect(validateUpload({ type: "application/pdf", size: 100 })).toEqual({
      ok: false,
      error: "Use a PNG, JPG, WebP, SVG or AVIF image",
    });
  });

  it("rejects an image over 8 MB and names the size", () => {
    expect(validateUpload({ type: "image/png", size: 12.4 * MB })).toEqual({
      ok: false,
      error: "Images must be 8 MB or smaller; this one is 12.4 MB",
    });
  });

  it("accepts a file exactly at the limit and rejects one byte over", () => {
    expect(MAX_UPLOAD_BYTES).toBe(8 * MB);
    expect(validateUpload({ type: "image/png", size: 8 * MB })).toEqual({ ok: true });
    expect(validateUpload({ type: "image/png", size: 8 * MB + 1 }).ok).toBe(false);
  });

  it("rejects an empty file", () => {
    expect(validateUpload({ type: "image/png", size: 0 })).toEqual({ ok: false, error: "This file is empty" });
  });
});

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"] as const;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export type UploadCheck = { ok: true } | { ok: false; error: string };

/** The same rules run in the browser (before uploading) and are enforced again by the upload route. */
export function validateUpload(file: { type: string; size: number }): UploadCheck {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, error: "Use a PNG, JPG, WebP, SVG or AVIF image" };
  }
  if (file.size <= 0) return { ok: false, error: "This file is empty" };
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return { ok: false, error: `Images must be 8 MB or smaller; this one is ${mb} MB` };
  }
  return { ok: true };
}

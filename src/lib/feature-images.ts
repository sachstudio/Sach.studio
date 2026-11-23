export const FEATURE_SHAPES = ["square", "rectangle"] as const;
export type FeatureShape = (typeof FEATURE_SHAPES)[number];
export type FeatureImage = { url: string; shape: FeatureShape };

function asShape(value: unknown): FeatureShape {
  return value === "square" ? "square" : "rectangle";
}

/**
 * Feature images used to be plain addresses (always shown as a wide rectangle). This reads both the
 * old and the new form, so pages saved before the shape option keep working.
 */
export function normalizeFeatureImages(value: unknown): FeatureImage[] {
  if (!Array.isArray(value)) return [];
  const images: FeatureImage[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      images.push({ url: item, shape: "rectangle" });
    } else if (item && typeof item === "object" && typeof (item as { url?: unknown }).url === "string") {
      images.push({ url: (item as { url: string }).url, shape: asShape((item as { shape?: unknown }).shape) });
    }
  }
  return images;
}

/** Rows for the page: neighbouring squares share a row in pairs, a rectangle always takes a row of its own. */
export function groupFeatureImages(images: FeatureImage[]): FeatureImage[][] {
  const rows: FeatureImage[][] = [];
  for (const image of images) {
    const last = rows[rows.length - 1];
    if (image.shape === "square" && last && last.length === 1 && last[0].shape === "square") {
      last.push(image);
    } else {
      rows.push([image]);
    }
  }
  return rows;
}

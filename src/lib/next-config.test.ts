import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("next.config images", () => {
  it("lets next/image load uploads from Vercel Blob, so admin-uploaded images are not broken", () => {
    const patterns = nextConfig.images?.remotePatterns ?? [];
    const blob = patterns.find(
      (p) => typeof p !== "string" && !(p instanceof URL) && p.hostname === "*.public.blob.vercel-storage.com",
    );
    expect(blob).toBeDefined();
  });

  it("allows no other image host", () => {
    expect((nextConfig.images?.remotePatterns ?? []).length).toBe(1);
  });
});

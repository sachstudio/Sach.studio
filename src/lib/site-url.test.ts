import { describe, expect, it } from "vitest";
import { siteUrl } from "./site-url";

describe("siteUrl", () => {
  it("prefers the address the owner set, without a trailing slash", () => {
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://sach.studio/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" })).toBe(
      "https://sach.studio",
    );
  });

  it("falls back to the Vercel production address, which Vercel supplies without a scheme", () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "sach-studio.vercel.app" })).toBe("https://sach-studio.vercel.app");
  });

  it("uses localhost when running on a computer", () => {
    expect(siteUrl({})).toBe("http://localhost:3000");
  });

  it("ignores blank values", () => {
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "  ", VERCEL_PROJECT_PRODUCTION_URL: "" })).toBe("http://localhost:3000");
  });
});

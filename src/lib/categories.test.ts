import { describe, expect, it } from "vitest";
import { CATEGORIES, categoryLabel, isCategorySlug } from "./categories";

describe("categories", () => {
  it("lists exactly the four Works categories in design order", () => {
    expect(CATEGORIES.map((c) => c.label)).toEqual([
      "Website & Landing Pages",
      "Mobile Apps",
      "Web Apps & Dashboard",
      "Logo & Branding",
    ]);
  });

  it("recognises valid slugs and rejects others", () => {
    expect(isCategorySlug("websites")).toBe(true);
    expect(isCategorySlug("branding")).toBe(false);
  });

  it("maps a slug to its label", () => {
    expect(categoryLabel("mobile-apps")).toBe("Mobile Apps");
  });
});

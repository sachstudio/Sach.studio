import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("Master Systems: Visualizing Marine Automated Solutions")).toBe(
      "master-systems-visualizing-marine-automated-solutions",
    );
  });

  it("strips stray punctuation and collapses separators", () => {
    expect(slugify("  --Hello__World!! ")).toBe("hello-world");
  });

  it("transliterates accents", () => {
    expect(slugify("Café Déjà Vu")).toBe("cafe-deja-vu");
  });

  it("returns an empty string when nothing usable is left", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("caps very long titles at 80 characters without a trailing hyphen", () => {
    const slug = slugify("word ".repeat(40));
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});

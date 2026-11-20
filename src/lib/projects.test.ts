import { describe, expect, it } from "vitest";
import { cardMeta, sortFeaturedFirst, toCardData, type ProjectSource } from "./projects";

const source: ProjectSource = {
  slug: "acme",
  title: "Acme",
  summary: "Summary",
  category: "websites",
  cardImageUrl: "/images/projects/acme.webp",
  statusLabel: null,
  displayDate: "10 Feb 2025",
  figmaUrl: "",
  about: "About text",
};

describe("toCardData", () => {
  it("offers the case study link only when the project has a detail body", () => {
    expect(toCardData(source).hasDetail).toBe(true);
    expect(toCardData({ ...source, about: "  " }).hasDetail).toBe(false);
  });

  it("keeps only what a card needs", () => {
    expect(Object.keys(toCardData(source)).sort()).toEqual(
      ["category", "cardImageUrl", "displayDate", "figmaUrl", "hasDetail", "slug", "statusLabel", "summary", "title"].sort(),
    );
  });
});

describe("cardMeta", () => {
  it("prefers the status label over the date", () => {
    expect(cardMeta({ statusLabel: "LIVE", displayDate: "10 Feb 2025" })).toBe("LIVE");
  });

  it("falls back to the date, then to nothing", () => {
    expect(cardMeta({ statusLabel: null, displayDate: "10 Feb 2025" })).toBe("10 Feb 2025");
    expect(cardMeta({ statusLabel: null, displayDate: null })).toBe("");
  });
});

describe("sortFeaturedFirst", () => {
  const row = (slug: string, isFeatured: boolean) => ({ slug, isFeatured });

  it("puts featured projects first and keeps the original order inside each group", () => {
    const sorted = sortFeaturedFirst([row("a", false), row("b", true), row("c", false), row("d", true)]);
    expect(sorted.map((r) => r.slug)).toEqual(["b", "d", "a", "c"]);
  });

  it("does not drop or change anything when none are featured, and does not mutate its input", () => {
    const input = [row("a", false), row("b", false)];
    expect(sortFeaturedFirst(input)).toEqual(input);
    const copy = [...input];
    sortFeaturedFirst(input);
    expect(input).toEqual(copy);
  });
});


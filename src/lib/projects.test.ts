import { describe, expect, it } from "vitest";
import { cardMeta, toCardData, type ProjectSource } from "./projects";

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

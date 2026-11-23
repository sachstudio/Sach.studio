import { describe, expect, it } from "vitest";
import { countByCategory, filterByCategory, formatEdited } from "./admin-list";

describe("formatEdited", () => {
  it("writes the day, short month and year", () => {
    expect(formatEdited(new Date("2026-11-23T06:00:00Z"))).toBe("23 Nov 2026");
  });

  it("uses Indian time, so a late-evening UTC edit shows the next day in Bangalore", () => {
    expect(formatEdited(new Date("2026-11-23T20:00:00Z"))).toBe("24 Nov 2026");
  });
});

const items = [
  { id: "1", category: "websites" as const },
  { id: "2", category: "websites" as const },
  { id: "3", category: "web-apps-dashboard" as const },
];

describe("filterByCategory", () => {
  it("keeps everything for 'all'", () => {
    expect(filterByCategory(items, "all")).toHaveLength(3);
  });

  it("keeps only the chosen category, in the original order", () => {
    expect(filterByCategory(items, "websites").map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("returns an empty list for a category with no items", () => {
    expect(filterByCategory(items, "mobile-apps")).toEqual([]);
  });
});

describe("countByCategory", () => {
  it("counts each of the four categories, including empty ones, plus the total", () => {
    expect(countByCategory(items)).toEqual({
      all: 3,
      websites: 2,
      "mobile-apps": 0,
      "web-apps-dashboard": 1,
      "logo-branding": 0,
    });
  });

  it("is all zeros for an empty list", () => {
    expect(countByCategory([]).all).toBe(0);
  });
});

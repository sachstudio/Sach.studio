import { describe, expect, it } from "vitest";
import { countByCategory, countByStatus, filterByCategory, filterByQuery, filterByStatus, formatEdited, pageNumbers, paginate, sortRows } from "./admin-list";

describe("filterByStatus", () => {
  const items = [
    { id: "1", status: "published" as const },
    { id: "2", status: "draft" as const },
    { id: "3", status: "published" as const },
  ];

  it("keeps everything for 'all'", () => {
    expect(filterByStatus(items, "all")).toHaveLength(3);
  });

  it("keeps only published or only draft items, in order", () => {
    expect(filterByStatus(items, "published").map((i) => i.id)).toEqual(["1", "3"]);
    expect(filterByStatus(items, "draft").map((i) => i.id)).toEqual(["2"]);
  });
});

describe("countByStatus", () => {
  it("counts all, published and draft items", () => {
    expect(
      countByStatus([{ status: "published" }, { status: "draft" }, { status: "published" }]),
    ).toEqual({ all: 3, published: 2, draft: 1 });
  });

  it("is all zeros for an empty list", () => {
    expect(countByStatus([])).toEqual({ all: 0, published: 0, draft: 0 });
  });
});

describe("sortRows", () => {
  const rows = [
    { id: "a", name: "banana", n: 2 },
    { id: "b", name: "Apple", n: 3 },
    { id: "c", name: "cherry", n: 1 },
  ];

  it("keeps the original order when no sort is chosen", () => {
    expect(sortRows(rows, null, "asc").map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("sorts text ignoring case, and numbers by value", () => {
    expect(sortRows(rows, (r) => r.name, "asc").map((r) => r.id)).toEqual(["b", "a", "c"]);
    expect(sortRows(rows, (r) => r.n, "asc").map((r) => r.id)).toEqual(["c", "a", "b"]);
  });

  it("reverses for descending", () => {
    expect(sortRows(rows, (r) => r.n, "desc").map((r) => r.id)).toEqual(["b", "a", "c"]);
  });

  it("does not change the list it was given", () => {
    const copy = [...rows];
    sortRows(rows, (r) => r.n, "asc");
    expect(rows).toEqual(copy);
  });

  it("keeps equal rows in their original order", () => {
    const same = [{ id: "x", n: 1 }, { id: "y", n: 1 }, { id: "z", n: 1 }];
    expect(sortRows(same, (r) => r.n, "asc").map((r) => r.id)).toEqual(["x", "y", "z"]);
  });
});

describe("pageNumbers", () => {
  it("lists every page when there are few", () => {
    expect(pageNumbers(1, 1)).toEqual([1]);
    expect(pageNumbers(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("shows a window around the current page with the first and last page, and gaps as null", () => {
    expect(pageNumbers(1, 20)).toEqual([1, 2, 3, null, 20]);
    expect(pageNumbers(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(pageNumbers(20, 20)).toEqual([1, null, 18, 19, 20]);
  });
});

describe("filterByQuery", () => {
  const items = [
    { title: "Gulf CV Writers", slug: "gulf-cv-writers" },
    { title: "Smiles by Sethna", slug: "smiles-dentist" },
  ];
  const fields = (i: { title: string; slug: string }) => [i.title, i.slug];

  it("keeps everything for an empty or blank query", () => {
    expect(filterByQuery(items, "", fields)).toHaveLength(2);
    expect(filterByQuery(items, "   ", fields)).toHaveLength(2);
  });

  it("matches any field, ignoring case and surrounding spaces", () => {
    expect(filterByQuery(items, "  SMILES ", fields).map((i) => i.slug)).toEqual(["smiles-dentist"]);
    expect(filterByQuery(items, "cv-writers", fields).map((i) => i.title)).toEqual(["Gulf CV Writers"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterByQuery(items, "zzz", fields)).toEqual([]);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it("returns the requested page and where it sits in the list", () => {
    expect(paginate(items, 2, 10)).toEqual({ items: items.slice(10, 20), page: 2, pageCount: 3, from: 11, to: 20, total: 25 });
  });

  it("makes the last page shorter", () => {
    const last = paginate(items, 3, 10);
    expect(last.items).toHaveLength(5);
    expect([last.from, last.to]).toEqual([21, 25]);
  });

  it("clamps a page that no longer exists, for example after a search shrinks the list", () => {
    expect(paginate(items, 9, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
  });

  it("copes with an empty list", () => {
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, pageCount: 1, from: 0, to: 0, total: 0 });
  });
});

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

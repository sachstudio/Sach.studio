import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const nav = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: nav.refresh }) }));

import { CaseStudyTable, type CaseStudyRow } from "./CaseStudyTable";

const row = (n: number, over: Partial<CaseStudyRow> = {}): CaseStudyRow => ({
  id: `id-${n}`,
  title: `Study ${n}`,
  slug: `study-${n}`,
  category: "websites",
  status: "published",
  isPlaceholder: false,
  cardImageUrl: "",
  edited: "23 Nov 2026",
  editedAt: "2026-11-23T06:00:00.000Z",
  ...over,
});

const rows: CaseStudyRow[] = [
  row(1, { title: "Gulf CV Writers", slug: "gulf-cv", cardImageUrl: "/images/projects/gulf.webp" }),
  row(2, { title: "Smiles by Sethna", slug: "smiles", status: "draft", edited: "24 Nov 2026", editedAt: "2026-11-24T06:00:00.000Z" }),
  row(3, { title: "MediSmart", slug: "medismart", category: "web-apps-dashboard", isPlaceholder: true, edited: "20 Nov 2026", editedAt: "2026-11-20T06:00:00.000Z" }),
];

beforeEach(() => nav.refresh.mockClear());

describe("CaseStudyTable", () => {
  describe("page heading", () => {
    it("is titled Case studies, with a line saying what the page is", () => {
      render(<CaseStudyTable rows={rows} />);
      expect(screen.getByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
      expect(screen.getByText("The projects shown on your Works page")).toBeInTheDocument();
    });

    it("has a New case study button in the heading", () => {
      render(<CaseStudyTable rows={rows} />);
      expect(screen.getByRole("link", { name: "New case study" })).toHaveAttribute("href", "/admin/case-studies/new");
    });

    it("has a Refresh button that reloads the list", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Refresh" }));
      expect(nav.refresh).toHaveBeenCalledTimes(1);
    });
  });

  it("shows one table row per case study with the columns an admin scans", () => {
    render(<CaseStudyTable rows={rows} />);
    const table = screen.getByRole("table", { name: "Case studies" });
    for (const name of ["Title", "Category", "Status", "Edited"]) {
      expect(within(table).getByRole("columnheader", { name })).toBeInTheDocument();
    }
    expect(within(table).getAllByRole("row")).toHaveLength(1 + rows.length); // header + data rows
    expect(screen.getByText("/works/gulf-cv")).toBeInTheDocument();
    expect(screen.getByText("Needs content")).toBeInTheDocument();
    expect(screen.getAllByText("Draft")).toHaveLength(1);
  });

  it("shows the category as plain text in its row", () => {
    render(<CaseStudyTable rows={rows} />);
    const medismart = screen.getByRole("link", { name: "MediSmart" }).closest("tr")!;
    expect(within(medismart).getByText("Web Apps & Dashboard")).toBeInTheDocument();
  });

  it("shows the card image as a thumbnail, and a quiet placeholder when there is none", () => {
    render(<CaseStudyTable rows={rows} />);
    expect(screen.getByRole("img", { name: "Gulf CV Writers card image" })).toBeInTheDocument();
    expect(screen.getAllByText("No image")).toHaveLength(2);
  });

  it("links each title to its edit page", () => {
    render(<CaseStudyTable rows={rows} />);
    expect(screen.getByRole("link", { name: "Smiles by Sethna" })).toHaveAttribute("href", "/admin/case-studies/id-2");
  });

  describe("category filter", () => {
    const filter = () => screen.getByRole("combobox", { name: "Filter by category" });

    it("offers All categories and one option per category, each with its count", () => {
      render(<CaseStudyTable rows={rows} />);
      const labels = within(filter())
        .getAllByRole("option")
        .map((o) => o.textContent);
      expect(labels).toEqual([
        "All categories (3)",
        "Website & Landing Pages (2)",
        "Mobile Apps (0)",
        "Web Apps & Dashboard (1)",
        "Logo & Branding (0)",
      ]);
      expect(filter()).toHaveValue("all");
    });

    it("narrows the table to the chosen category and back to all", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.selectOptions(filter(), "web-apps-dashboard");
      expect(screen.getByRole("link", { name: "MediSmart" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Gulf CV Writers" })).not.toBeInTheDocument();

      await userEvent.selectOptions(filter(), "all");
      expect(screen.getByRole("link", { name: "Gulf CV Writers" })).toBeInTheDocument();
    });

    it("explains an empty category inside the table frame", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.selectOptions(filter(), "mobile-apps");
      expect(screen.getByText("No case studies in Mobile Apps yet.")).toBeInTheDocument();
      expect(screen.getByRole("table", { name: "Case studies" })).toBeInTheDocument();
    });
  });

  it("explains an empty list", () => {
    render(<CaseStudyTable rows={[]} />);
    expect(screen.getByText("No case studies yet. Add the first one with New case study.")).toBeInTheDocument();
  });

  it("starts with the search you made from the top bar", () => {
    render(<CaseStudyTable rows={rows} initialQuery="smiles" />);
    expect(screen.getByRole("searchbox", { name: "Search case studies" })).toHaveValue("smiles");
    expect(screen.getByRole("link", { name: "Smiles by Sethna" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Gulf CV Writers" })).not.toBeInTheDocument();
  });

  describe("sorting", () => {
    const titles = () => screen.getAllByRole("link", { name: /Gulf|Smiles|MediSmart/ }).map((a) => a.textContent);

    it("sorts by title, then reverses on a second click", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Title" }));
      expect(titles()).toEqual(["Gulf CV Writers", "MediSmart", "Smiles by Sethna"]);
      expect(screen.getByRole("columnheader", { name: /Title/ })).toHaveAttribute("aria-sort", "ascending");
      await userEvent.click(screen.getByRole("button", { name: "Title" }));
      expect(titles()).toEqual(["Smiles by Sethna", "MediSmart", "Gulf CV Writers"]);
      expect(screen.getByRole("columnheader", { name: /Title/ })).toHaveAttribute("aria-sort", "descending");
    });

    it("sorts by when it was last edited, using the real date rather than the label", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Edited" }));
      expect(titles()).toEqual(["MediSmart", "Gulf CV Writers", "Smiles by Sethna"]);
    });

    it("sorts the whole list, not just the page you are on", async () => {
      const many = Array.from({ length: 12 }, (_, i) => row(i + 1, { title: `Study ${String(i + 1).padStart(2, "0")}` }));
      render(<CaseStudyTable rows={many} />);
      await userEvent.click(screen.getByRole("button", { name: "Title" }));
      await userEvent.click(screen.getByRole("button", { name: "Title" })); // descending
      expect(screen.getByRole("link", { name: "Study 12" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Study 01" })).not.toBeInTheDocument();
    });
  });

  describe("search", () => {
    it("filters by title or address as you type", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.type(screen.getByRole("searchbox", { name: "Search case studies" }), "smiles");
      expect(screen.getByRole("link", { name: "Smiles by Sethna" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "MediSmart" })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Gulf CV Writers" })).not.toBeInTheDocument();
    });

    it("works together with the category filter", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.selectOptions(screen.getByRole("combobox", { name: "Filter by category" }), "web-apps-dashboard");
      await userEvent.type(screen.getByRole("searchbox", { name: "Search case studies" }), "gulf");
      expect(screen.getByText("No case studies match “gulf”.")).toBeInTheDocument();
    });

    it("says so when nothing matches", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.type(screen.getByRole("searchbox", { name: "Search case studies" }), "zzz");
      expect(screen.getByText("No case studies match “zzz”.")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    const many = Array.from({ length: 12 }, (_, i) => row(i + 1));

    it("shows ten rows at a time and says how many there are", () => {
      render(<CaseStudyTable rows={many} />);
      expect(within(screen.getByRole("table", { name: "Case studies" })).getAllByRole("row")).toHaveLength(11);
      expect(screen.getByText("1-10 of 12")).toBeInTheDocument();
    });

    it("moves to the next page", async () => {
      render(<CaseStudyTable rows={many} />);
      await userEvent.click(screen.getByRole("button", { name: "Next page" }));
      expect(screen.getByText("11-12 of 12")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Study 12" })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Study 1" })).not.toBeInTheDocument();
    });

    it("returns to page one when the search changes", async () => {
      render(<CaseStudyTable rows={many} />);
      await userEvent.click(screen.getByRole("button", { name: "Next page" }));
      await userEvent.type(screen.getByRole("searchbox", { name: "Search case studies" }), "Study 1");
      expect(screen.getByText(/^1-\d+ of \d+$/)).toBeInTheDocument();
    });

    it("returns to page one when the category changes", async () => {
      render(<CaseStudyTable rows={many} />);
      await userEvent.click(screen.getByRole("button", { name: "Next page" }));
      await userEvent.selectOptions(screen.getByRole("combobox", { name: "Filter by category" }), "websites");
      expect(screen.getByText("1-10 of 12")).toBeInTheDocument();
    });
  });

  describe("row actions", () => {
    it("lets you edit or preview any case study, and open the live page only when it is published", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Actions for Gulf CV Writers" }));
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute("href", "/admin/case-studies/id-1");
      expect(screen.getByRole("menuitem", { name: "Preview" })).toHaveAttribute("href", "/admin/case-studies/id-1/preview");
      expect(screen.getByRole("menuitem", { name: "View live page" })).toHaveAttribute("href", "/works/gulf-cv");
    });

    it("has no live page link for a draft", async () => {
      render(<CaseStudyTable rows={rows} />);
      await userEvent.click(screen.getByRole("button", { name: "Actions for Smiles by Sethna" }));
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "View live page" })).not.toBeInTheDocument();
    });
  });
});

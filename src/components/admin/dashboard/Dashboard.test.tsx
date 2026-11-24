import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { buildDashboard } from "@/lib/admin-dashboard";
import { Dashboard } from "./Dashboard";

const data = buildDashboard(
  [
    { id: "s1", title: "Gulf CV Writers", category: "websites", status: "published", updatedAt: new Date("2026-11-20T06:00:00Z") },
    { id: "s2", title: "Smiles by Sethna", category: "websites", status: "draft", updatedAt: new Date("2026-11-23T06:00:00Z") },
  ],
  [{ id: "p1", title: "Use of AI", status: "published", updatedAt: new Date("2026-11-21T06:00:00Z") }],
);

describe("Dashboard", () => {
  it("greets you by name under the page's main heading", () => {
    render(<Dashboard data={data} greeting="Good morning" name="Sachin" />);
    expect(screen.getByRole("heading", { level: 1, name: "Good morning, Sachin" })).toBeInTheDocument();
    expect(screen.getByText("Here is what is on your website today")).toBeInTheDocument();
  });

  it("offers a refresh and a quick way to add a case study", () => {
    render(<Dashboard data={data} greeting="Good evening" name="there" />);
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /New case study/ })).toHaveAttribute("href", "/admin/case-studies/new");
  });

  it("shows every section of the Modern layout", () => {
    render(<Dashboard data={data} greeting="Good evening" name="there" />);
    for (const title of ["Content overview", "Recently edited"]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Published case studies")).toBeInTheDocument();
    expect(screen.getByText("Case study drafts")).toBeInTheDocument();
    expect(screen.getByText("Blog posts")).toBeInTheDocument();
  });

  it("does not repeat the same counts in a separate Total content card", () => {
    render(<Dashboard data={data} greeting="Good evening" name="there" />);
    expect(screen.queryByRole("heading", { name: "Total content" })).toBeNull();
  });

  it("stacks the stat cards beside the chart instead of in a row below it", () => {
    render(<Dashboard data={data} greeting="Good evening" name="there" />);
    const chart = screen.getByRole("heading", { level: 2, name: "Content overview" }).closest("[class*=col-span]") as HTMLElement;
    const stat = screen.getByText("Published case studies").closest("[class*=col-span]") as HTMLElement;
    expect(stat.parentElement).toBe(chart.parentElement);
    expect(stat.className).toContain("lg:col-span-5");
  });

  it("uses the real data: the latest edit, and the draft waiting to be published", () => {
    render(<Dashboard data={data} greeting="Good evening" name="there" />);
    expect(screen.getByText("Last edited: Smiles by Sethna (Case study)")).toBeInTheDocument();
    expect(screen.getByText(/1 case study is a draft waiting to be published/)).toBeInTheDocument();
  });
});

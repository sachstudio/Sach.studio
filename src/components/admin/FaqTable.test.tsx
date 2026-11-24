import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { FaqTable, type FaqRow } from "./FaqTable";

const row = (o: Partial<FaqRow> = {}): FaqRow => ({
  id: "f1",
  question: "How long does a project take?",
  answer: "Most projects take 1 to 6 weeks.",
  pages: ["home"],
  status: "published",
  position: 10,
  ...o,
});

const rows = [
  row(),
  row({ id: "f2", question: "Can I reschedule my call?", pages: ["contact"], position: 20 }),
  row({ id: "f3", question: "What do I prepare?", pages: ["home", "contact"], status: "draft", position: 30 }),
];

describe("FaqTable", () => {
  it("lists each FAQ with the pages it shows on, whether it is live, and its position", () => {
    render(<FaqTable rows={rows} />);
    const table = within(screen.getByRole("table", { name: "FAQs" }));
    expect(table.getByRole("link", { name: "How long does a project take?" })).toHaveAttribute("href", "/admin/faqs/f1");
    expect(table.getAllByText("Home page").length).toBeGreaterThan(0);
    expect(table.getAllByText("Contact page").length).toBeGreaterThan(0);
    expect(table.getByText("Hidden")).toBeInTheDocument();
    expect(table.getAllByText("Shown")).toHaveLength(2);
  });

  it("filters by page, counting a FAQ on both pages under each", async () => {
    render(<FaqTable rows={rows} />);
    expect(screen.getByRole("button", { name: /All pages/ })).toHaveTextContent("3");
    expect(screen.getByRole("button", { name: /Home page/ })).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: /Contact page/ })).toHaveTextContent("2");

    await userEvent.click(screen.getByRole("button", { name: /Contact page/ }));
    const table = within(screen.getByRole("table", { name: "FAQs" }));
    expect(table.queryByText("How long does a project take?")).toBeNull();
    expect(table.getByText("Can I reschedule my call?")).toBeInTheDocument();
    expect(table.getByText("What do I prepare?")).toBeInTheDocument();
  });

  it("offers a way to add a FAQ and explains an empty list", () => {
    render(<FaqTable rows={[]} />);
    expect(screen.getByRole("link", { name: /New FAQ/ })).toHaveAttribute("href", "/admin/faqs/new");
    expect(screen.getByText(/No FAQs yet/)).toBeInTheDocument();
  });

  it("says when a page has none", async () => {
    render(<FaqTable rows={[row()]} />);
    await userEvent.click(screen.getByRole("button", { name: /Contact page/ }));
    expect(screen.getByText(/No FAQs on the Contact page yet/)).toBeInTheDocument();
  });
});

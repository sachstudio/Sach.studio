import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { UpdateBanner } from "./UpdateBanner";

const latest = { kind: "Blog post" as const, title: "Use of AI", updatedAt: new Date("2026-11-24T06:00:00Z") };

describe("UpdateBanner", () => {
  it("says what was edited last and when", () => {
    render(<UpdateBanner latest={latest} drafts={0} />);
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("24 Nov 2026")).toBeInTheDocument();
    expect(screen.getByText("Last edited: Use of AI (Blog post)")).toBeInTheDocument();
  });

  it("points out drafts that are waiting to be published", () => {
    render(<UpdateBanner latest={latest} drafts={3} />);
    expect(screen.getByText(/3 case studies are drafts waiting to be published/)).toBeInTheDocument();
  });

  it("uses the singular for one draft", () => {
    render(<UpdateBanner latest={latest} drafts={1} />);
    expect(screen.getByText(/1 case study is a draft waiting to be published/)).toBeInTheDocument();
  });

  it("does not mention drafts when there are none", () => {
    render(<UpdateBanner latest={latest} drafts={0} />);
    expect(screen.queryByText(/waiting to be published/)).not.toBeInTheDocument();
  });

  it("welcomes you to an empty admin instead of showing a blank line", () => {
    render(<UpdateBanner latest={null} drafts={0} />);
    expect(screen.getByText("Nothing here yet. Add your first case study to get started.")).toBeInTheDocument();
    expect(screen.queryByText(/Last edited/)).not.toBeInTheDocument();
  });

  it("always links on to the case studies list", () => {
    render(<UpdateBanner latest={null} drafts={0} />);
    expect(screen.getByRole("link", { name: /See case studies/ })).toHaveAttribute("href", "/admin/case-studies");
  });
});

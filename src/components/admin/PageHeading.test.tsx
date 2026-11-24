import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeading } from "./PageHeading";

describe("PageHeading", () => {
  it("shows the title as the page's main heading, with a line of help under it", () => {
    render(<PageHeading title="Case studies" subtitle="The projects shown on your Works page." />);
    expect(screen.getByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
    expect(screen.getByText("The projects shown on your Works page.")).toBeInTheDocument();
  });

  it("puts the page's actions on the right", () => {
    render(
      <PageHeading title="Case studies">
        <button type="button">New case study</button>
      </PageHeading>,
    );
    expect(screen.getByRole("button", { name: "New case study" })).toBeInTheDocument();
  });

  it("shows a back button before the title only when asked", () => {
    const { rerender } = render(<PageHeading title="Edit post" />);
    expect(screen.queryByRole("link", { name: /^Back/ })).toBeNull();
    rerender(<PageHeading title="Edit post" back={{ href: "/admin/posts", label: "Blog posts" }} />);
    expect(screen.getByRole("link", { name: "Back to Blog posts" })).toHaveAttribute("href", "/admin/posts");
  });

  it("works without a subtitle or actions", () => {
    render(<PageHeading title="Blog posts" />);
    expect(screen.getByRole("heading", { name: "Blog posts" })).toBeInTheDocument();
  });
});

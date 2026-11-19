import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostBody } from "./PostBody";

describe("PostBody", () => {
  it("renders Markdown headings and paragraphs", () => {
    render(<PostBody markdown={"## Why it matters\n\nFirst paragraph."} />);
    expect(screen.getByRole("heading", { level: 2, name: "Why it matters" })).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
  });

  it("does not render raw HTML or script tags written in the body", () => {
    const { container } = render(<PostBody markdown={'Hello <script>alert(1)</script> <img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img[onerror]")).toBeNull();
  });

  it("opens external links safely in a new tab", () => {
    render(<PostBody markdown="Read [the docs](https://example.com)." />);
    const link = screen.getByRole("link", { name: "the docs" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});

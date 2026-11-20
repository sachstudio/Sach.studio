import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitText } from "./SplitText";

describe("SplitText", () => {
  it("keeps the text exactly as written so reading, searching and copying are unchanged", () => {
    const { container } = render(<h1><SplitText text="We Build High-Performing" /></h1>);
    expect(container.textContent).toBe("We Build High-Performing");
    expect(screen.getByRole("heading", { name: "We Build High-Performing" })).toBeInTheDocument();
  });

  it("wraps each word in its own span with a rising index for the stagger", () => {
    const { container } = render(<SplitText text="One two three" />);
    const words = [...container.querySelectorAll("[data-word]")] as HTMLElement[];
    expect(words.map((w) => w.textContent)).toEqual(["One", "two", "three"]);
    expect(words.map((w) => w.style.getPropertyValue("--i"))).toEqual(["0", "1", "2"]);
  });

  it("continues the index from startIndex so a second phrase follows the first", () => {
    const { container } = render(<SplitText text="Real Growth" startIndex={4} />);
    const words = [...container.querySelectorAll("[data-word]")] as HTMLElement[];
    expect(words.map((w) => w.style.getPropertyValue("--i"))).toEqual(["4", "5"]);
  });

  it("caps the stagger so a long title does not make visitors wait", () => {
    const text = Array.from({ length: 30 }, (_, i) => `w${i}`).join(" ");
    const { container } = render(<SplitText text={text} />);
    const words = [...container.querySelectorAll("[data-word]")] as HTMLElement[];
    expect(Math.max(...words.map((w) => Number(w.style.getPropertyValue("--i"))))).toBeLessThanOrEqual(10);
  });

  it("ignores extra spaces", () => {
    const { container } = render(<SplitText text="  a   b " />);
    expect([...container.querySelectorAll("[data-word]")].map((w) => w.textContent)).toEqual(["a", "b"]);
  });
});

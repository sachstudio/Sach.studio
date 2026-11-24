import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";

let trigger: ((entry: Partial<IntersectionObserverEntry>) => void) | null = null;
const disconnect = vi.fn();

beforeEach(() => {
  trigger = null;
  disconnect.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
        trigger = (entry) => cb([entry as IntersectionObserverEntry]);
      }
      observe() {}
      disconnect = disconnect;
      unobserve() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

function place(top: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top } as DOMRect);
}

describe("Reveal", () => {
  it("shows its content with no animation class when it is already on screen at load", () => {
    place(100);
    render(<Reveal><p>Visible text</p></Reveal>);
    const box = screen.getByText("Visible text").parentElement!;
    expect(box.dataset.reveal).toBe("idle");
  });

  it("keeps content below the fold hidden until it scrolls into view, then reveals it once", () => {
    place(5000);
    render(<Reveal><p>Lower text</p></Reveal>);
    const box = screen.getByText("Lower text").parentElement!;
    expect(box.dataset.reveal).toBe("hidden");
    act(() => trigger?.({ isIntersecting: false }));
    expect(box.dataset.reveal).toBe("hidden");
    act(() => trigger?.({ isIntersecting: true }));
    expect(box.dataset.reveal).toBe("shown");
    expect(disconnect).toHaveBeenCalled();
  });

  it("reveals a block the visitor scrolled past or jumped over, even if the observer never reported it", () => {
    const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 5000 } as DOMRect);
    render(<Reveal><p>Skipped over</p></Reveal>);
    const box = screen.getByText("Skipped over").parentElement!;
    expect(box.dataset.reveal).toBe("hidden");
    // A fast fling or an anchor link: the block is now above the screen, and no observer callback ever came.
    rect.mockReturnValue({ top: -1200 } as DOMRect);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(box.dataset.reveal).toBe("shown");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays hidden on scroll while the block is still well below the screen", () => {
    place(5000);
    render(<Reveal><p>Far below</p></Reveal>);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByText("Far below").parentElement!.dataset.reveal).toBe("hidden");
  });

  it("always keeps the text in the page so it can be read without scrolling effects", () => {
    place(5000);
    render(<Reveal><p>Always in the DOM</p></Reveal>);
    expect(screen.getByText("Always in the DOM")).toBeInTheDocument();
  });

  it("shows everything straight away when the browser cannot observe scrolling", () => {
    place(5000);
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal><p>No observer</p></Reveal>);
    expect(screen.getByText("No observer").parentElement!.dataset.reveal).toBe("idle");
  });

  it("plays the entrance animation once it is shown, hidden at opacity 0 before that", () => {
    place(5000);
    render(<Reveal><p>Animated</p></Reveal>);
    const box = screen.getByText("Animated").parentElement!;
    expect(box).toHaveClass("opacity-0");
    expect(box).not.toHaveClass("motion-enter");
    act(() => trigger?.({ isIntersecting: true }));
    expect(box).toHaveClass("motion-enter");
    expect(box).not.toHaveClass("opacity-0");
  });

  it("stays shown once revealed and never hides or replays again", () => {
    place(5000);
    const { rerender } = render(<Reveal><p>Once</p></Reveal>);
    const box = screen.getByText("Once").parentElement!;
    act(() => trigger?.({ isIntersecting: true }));
    act(() => trigger?.({ isIntersecting: false }));
    rerender(<Reveal><p>Once</p></Reveal>);
    expect(box.dataset.reveal).toBe("shown");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("sets --motion-delay from the delay prop, and nothing when there is no delay", () => {
    place(5000);
    render(
      <>
        <Reveal delay={100}><p>Second</p></Reveal>
        <Reveal><p>First</p></Reveal>
      </>,
    );
    expect(screen.getByText("Second").parentElement!.style.getPropertyValue("--motion-delay")).toBe("100ms");
    expect(screen.getByText("First").parentElement!.style.getPropertyValue("--motion-delay")).toBe("");
  });

  it("passes the layout classes through to its wrapper", () => {
    place(100);
    render(<Reveal className="w-full min-w-0 flex flex-col"><p>Layout</p></Reveal>);
    expect(screen.getByText("Layout").parentElement).toHaveClass("w-full", "min-w-0", "flex", "flex-col");
  });

  it("never hides content for people who asked for reduced motion", () => {
    place(5000);
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    render(<Reveal><p>Calm</p></Reveal>);
    const box = screen.getByText("Calm").parentElement!;
    expect(box.dataset.reveal).toBe("idle");
    expect(box).not.toHaveClass("opacity-0");
  });
});

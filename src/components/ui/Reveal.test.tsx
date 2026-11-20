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
});

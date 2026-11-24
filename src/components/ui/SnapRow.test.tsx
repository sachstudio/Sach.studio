import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnapRow, SnapSlide } from "./SnapRow";

function setup(count = 3, props: Partial<React.ComponentProps<typeof SnapRow>> = {}) {
  return render(
    <SnapRow label="Our process, swipe to see more steps" as="ol" className="md:grid md:grid-cols-3" {...props}>
      {Array.from({ length: count }, (_, i) => (
        <SnapSlide key={i} as="li">
          Card {i + 1}
        </SnapSlide>
      ))}
    </SnapRow>,
  );
}

/** Place the slides side by side the way the browser would: 300px each, row starting at x = 0. */
function layoutSlides(region: HTMLElement) {
  vi.spyOn(region, "getBoundingClientRect").mockReturnValue({ left: 0 } as DOMRect);
  const slides = Array.from(region.querySelectorAll("li"));
  slides.forEach((slide, i) => {
    vi.spyOn(slide, "getBoundingClientRect").mockImplementation(() => ({ left: i * 316 - region.scrollLeft }) as DOMRect);
  });
  Object.defineProperty(region, "clientWidth", { configurable: true, value: 375 });
  Object.defineProperty(region, "scrollWidth", { configurable: true, value: 1000 });
}

let scrollTo: ReturnType<typeof vi.fn>;
let raf: FrameRequestCallback[];

beforeEach(() => {
  scrollTo = vi.fn();
  HTMLElement.prototype.scrollTo = scrollTo as unknown as typeof HTMLElement.prototype.scrollTo;
  raf = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => raf.push(cb));
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("SnapRow", () => {
  it("is a labelled, keyboard-focusable region", () => {
    setup();
    const region = screen.getByRole("region", { name: "Our process, swipe to see more steps" });
    expect(region).toHaveAttribute("tabindex", "0");
  });

  it("renders every slide as a list item in the original order", () => {
    setup(4);
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["Card 1", "Card 2", "Card 3", "Card 4"]);
  });

  it("scrolls sideways with snapping on phones and becomes the caller's grid from md up", () => {
    setup();
    const region = screen.getByRole("region");
    expect(region.className).toContain("snap-x");
    expect(region.className).toContain("snap-mandatory");
    expect(region.className).toContain("overflow-x-auto");
    expect(region.className).toContain("overscroll-x-contain");
    expect(region.className).toContain("md:overflow-visible");
    const track = screen.getByRole("list");
    expect(track.className).toContain("md:grid md:grid-cols-3");
    expect(track.className).toContain("items-stretch");
    const slide = screen.getAllByRole("listitem")[0];
    expect(slide.className).toContain("snap-start");
    expect(slide.className).toContain("max-w-[340px]");
    expect(slide.className).toContain("md:w-auto");
  });

  it("shows one dot per slide, each a button with a name, and hides the dots from md up", () => {
    setup(4);
    const dots = screen.getAllByRole("button");
    expect(dots.map((d) => d.getAttribute("aria-label"))).toEqual([
      "Go to slide 1 of 4",
      "Go to slide 2 of 4",
      "Go to slide 3 of 4",
      "Go to slide 4 of 4",
    ]);
    expect(dots[0].parentElement!.className).toContain("md:hidden");
  });

  it("gives every dot a 44px hit area", () => {
    setup();
    for (const dot of screen.getAllByRole("button")) {
      expect(dot.className).toContain("size-11");
    }
  });

  it("marks the first dot as current and has no dots for a single slide", () => {
    const { unmount } = setup(3);
    const dots = screen.getAllByRole("button");
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).not.toHaveAttribute("aria-current");
    unmount();
    setup(1);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("scrolls the chosen slide into place when its dot is clicked, smoothly by default", async () => {
    setup(3);
    const region = screen.getByRole("region");
    layoutSlides(region);
    await userEvent.click(screen.getByRole("button", { name: "Go to slide 2 of 3" }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 316, behavior: "smooth" });
    expect(screen.getByRole("button", { name: "Go to slide 2 of 3" })).toHaveAttribute("aria-current", "true");
  });

  it("jumps instead of gliding when the visitor prefers reduced motion", async () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    setup(3);
    layoutSlides(screen.getByRole("region"));
    await userEvent.click(screen.getByRole("button", { name: "Go to slide 3 of 3" }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 632, behavior: "auto" });
  });

  it("moves the highlighted dot as the row is scrolled", () => {
    setup(3);
    const region = screen.getByRole("region");
    layoutSlides(region);
    region.scrollLeft = 316;
    fireEvent.scroll(region);
    act(() => raf.splice(0).forEach((cb) => cb(0)));
    expect(screen.getByRole("button", { name: "Go to slide 2 of 3" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Go to slide 1 of 3" })).not.toHaveAttribute("aria-current");
  });

  it("marks the last dot once the row is scrolled all the way to its end", () => {
    setup(3);
    const region = screen.getByRole("region");
    layoutSlides(region);
    region.scrollLeft = 625; // 625 + 375 >= 1000 - 2
    fireEvent.scroll(region);
    act(() => raf.splice(0).forEach((cb) => cb(0)));
    expect(screen.getByRole("button", { name: "Go to slide 3 of 3" })).toHaveAttribute("aria-current", "true");
  });

  it("is a plain grid with no region or tab stop when the screen is md or wider", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("min-width"), media: q, addEventListener() {}, removeEventListener() {} }));
    setup();
    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.getByRole("list").parentElement).not.toHaveAttribute("tabindex");
  });
});

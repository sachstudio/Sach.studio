"use client";

import { Children, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A row of cards that swipes sideways on phones (under 768px) and is an ordinary grid from md up.
 *
 * Phones: CSS scroll-snap, each slide about 84vw wide (max 340px) so the next card peeks, the row runs
 * edge to edge (it cancels the section's 16px / 24px side padding), plus a dot per slide underneath.
 * md and up: no scrolling, no dots; the caller's `className` decides the layout (for example `md:grid md:grid-cols-2`).
 *
 * Children become the slides, in DOM order. Wrap each one in <SnapSlide> (it carries the slide sizing).
 */

const MD_QUERY = "(min-width: 768px)";

function subscribeWide(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(MD_QUERY);
  mq.addEventListener?.("change", onChange);
  // Some embedded browsers and device emulators resize without firing the media query event.
  window.addEventListener("resize", onChange);
  return () => {
    mq.removeEventListener?.("change", onChange);
    window.removeEventListener("resize", onChange);
  };
}
const getWide = () => (typeof window !== "undefined" && !!window.matchMedia ? window.matchMedia(MD_QUERY).matches : false);
const getWideOnServer = () => false;

function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type RowTag = "div" | "ul" | "ol";
type SlideTag = "div" | "li" | "article";

export function SnapSlide({
  as: Tag = "div",
  className,
  children,
}: {
  as?: SlideTag;
  className?: string;
  children: ReactNode;
}) {
  const Component = Tag as ElementType;
  return (
    <Component
      className={cn(
        // Phones: a fixed-ish slide that snaps to the start. md+: back to a normal grid item.
        "w-[84vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function SnapRow({
  label,
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  /** Names the scrolling region for screen readers, e.g. "Our process, swipe to see more steps". */
  label: string;
  /** Element holding the slides: "ol" / "ul" when every slide is an `li`. */
  as?: RowTag;
  /** Layout from md up (grid classes) and anything extra for the slide track. */
  className?: string;
  children: ReactNode;
  "aria-live"?: "polite" | "off";
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const frame = useRef(0);
  const count = Children.toArray(children).length;
  const wide = useSyncExternalStore(subscribeWide, getWide, getWideOnServer);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return;
    // The last slide can never reach the start edge, so once the row is scrolled to its end it is the active one.
    if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2 && scroller.scrollWidth > scroller.clientWidth) {
      setActive(slides.length - 1);
      return;
    }
    const scrollerLeft = scroller.getBoundingClientRect().left;
    const pad = parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - (scrollerLeft + pad));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        measure();
      });
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    // Where supported, settle the dots once the snap animation has finished.
    scroller.addEventListener("scrollend", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [measure]);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    if (!scroller || !slide) return;
    const pad = parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0;
    const left = scroller.scrollLeft + slide.getBoundingClientRect().left - scroller.getBoundingClientRect().left - pad;
    scroller.scrollTo?.({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setActive(index);
  }

  const Track = Tag as ElementType;
  const current = Math.min(active, Math.max(0, count - 1));

  return (
    <div className="min-w-0">
      <div
        ref={scrollerRef}
        // From md up the row is a plain grid: no landmark, no extra tab stop.
        role={wide ? undefined : "region"}
        aria-label={wide ? undefined : label}
        tabIndex={wide ? undefined : 0}
        className={cn(
          // Bleed to the screen edges (cancel the section padding); py/-my leave room for card shadows and the hover lift.
          "-mx-4 -my-4 snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "scroll-px-4 sm:-mx-6 sm:scroll-px-6",
          "focus-visible:outline-offset-[-2px]!",
          "md:mx-0 md:my-0 md:snap-none md:overflow-visible md:py-0 md:scroll-px-0",
        )}
      >
        <Track
          ref={trackRef}
          aria-live={rest["aria-live"]}
          className={cn("flex w-max items-stretch gap-4 px-4 sm:px-6", "md:w-auto md:px-0", className)}
        >
          {children}
        </Track>
      </div>
      {count > 1 && (
        <div className="mt-1 flex flex-wrap justify-center md:hidden">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1} of ${count}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => goTo(i)}
              className="grid size-11 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 rounded-full transition-transform duration-150 ease-out motion-reduce:transition-none",
                  i === current ? "scale-125 bg-blue-500" : "bg-neutral-300",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

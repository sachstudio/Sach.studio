"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Stagger steps for siblings that enter together (ms). */
export type RevealDelay = 0 | 100 | 200;

type RevealProps = { children: ReactNode; className?: string; delay?: RevealDelay };

/**
 * Fades a block up once as it scrolls into view. Content that is already on screen at load, or on a
 * browser that cannot observe scrolling, is simply shown. The text is always in the page.
 * (idle = shown normally, hidden = waiting to scroll in, shown = revealed)
 *
 * Wrap a whole GROUP (a card grid, a swipe row, a list), not each card. The wrapper is a plain block div:
 * pass the layout classes of the element it replaces (w-full, max-w-*, flex ..., gap-*) through `className`.
 * Siblings that enter together may be staggered with `delay` of 0, 100 or 200 (ms), never more.
 * It reveals once as soon as any part of the group is in view, so groups taller than the screen still reveal.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Reduced motion: no hiding and no rise, the content is simply there.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("hidden"); // armed only after mount, so the server HTML is always visible

    const stop = () => {
      observer.disconnect();
      window.removeEventListener("scroll", check);
    };
    const show = () => {
      stop();
      setState("shown");
    };
    // The observer only reports a block while it crosses the screen. A fast fling or an anchor link can jump
    // straight over it, so scrolling also checks: a block that has come up to, or gone above, the lower part of
    // the screen is shown, and nobody ever scrolls back to a blank gap.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) show();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) show();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    return stop;
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state}
      style={delay ? ({ "--motion-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(state === "hidden" && "opacity-0", state === "shown" && "motion-enter", className)}
    >
      {children}
    </div>
  );
}

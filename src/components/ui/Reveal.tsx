"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = { children: ReactNode; className?: string; delay?: number };

/**
 * Fades a block up once as it scrolls into view. Content that is already on screen at load, or on a
 * browser that cannot observe scrolling, is simply shown. The text is always in the page.
 * (idle = shown normally, hidden = waiting to scroll in, shown = revealed)
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("hidden"); // armed only after mount, so the server HTML is always visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
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

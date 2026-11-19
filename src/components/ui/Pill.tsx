import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PillProps = { tone: "green" | "blue" | "neutral"; children: ReactNode; className?: string };

const tones = {
  green: "bg-[#d9f2e4] text-neutral-800 border-[#bfe6d0] uppercase tracking-[0.06em] font-medium",
  blue: "bg-blue-50 text-blue-600 border-blue-200 font-medium",
  neutral: "bg-neutral-100 text-neutral-600 border-neutral-200",
} as const;

export function Pill({ tone, children, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs leading-none",
        tones[tone],
        className,
      )}
    >
      {tone === "green" && <span aria-hidden className="size-2 rounded-full bg-[#16a34a]" />}
      {children}
    </span>
  );
}

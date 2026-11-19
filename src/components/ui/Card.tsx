import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-neutral-200 bg-white shadow-card", className)}>{children}</div>
  );
}

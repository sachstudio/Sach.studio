"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type TabsProps<T extends string> = {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
};

export function Tabs<T extends string>({ items, value, onChange, label = "Categories", className }: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.value === value);
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next === -1) return;
    event.preventDefault();
    onChange(items[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-100 p-1",
        className,
      )}
    >
      {items.map((item, i) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-colors",
              selected
                ? "bg-white font-semibold text-blue-500 shadow-[0_1px_3px_rgb(15_23_42/0.1)]"
                : "font-normal text-neutral-600 hover:text-neutral-900",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

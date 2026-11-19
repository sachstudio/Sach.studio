"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type AccordionProps = {
  items: { id: string; question: string; answer: string }[];
  defaultOpenId?: string;
};

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);
  const uid = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = item.id === openId;
        const panelId = `${uid}-${item.id}-panel`;
        return (
          <div key={item.id} className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-card">
            <div
              className={cn(
                "rounded-xl border",
                open ? "border-blue-200 bg-blue-50" : "border-transparent bg-neutral-100",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-serif text-[22px] leading-snug text-neutral-900"
                >
                  {item.question}
                  <svg
                    aria-hidden
                    viewBox="0 0 12 8"
                    className={cn("size-3 shrink-0 text-neutral-500 motion-rotate", open && "rotate-180")}
                  >
                    <path d="M1 1.5 6 6.5l5-5z" fill="currentColor" />
                  </svg>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                hidden={!open}
                className="motion-enter-small px-5 pb-5 pr-8 text-base leading-[1.75] text-neutral-600"
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

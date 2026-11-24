"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";

/** What a card needs. The home page passes the published rows from the database. */
export type TestimonialItem = { id: string; name: string; role: string; tag: string; quote: string; avatarUrl: string };

const PER_PAGE = 2;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
      <div className="flex h-full flex-col gap-8 rounded-2xl bg-neutral-100/70 p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          {item.avatarUrl ? (
            <Image src={item.avatarUrl} alt="" width={80} height={52} unoptimized className="h-10 w-auto rounded-full" />
          ) : (
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700"
            >
              {initials(item.name)}
            </span>
          )}
          {item.tag && (
            <span className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600">
              {item.tag}
            </span>
          )}
        </div>
        <blockquote className="text-lg leading-[1.75] text-neutral-900 sm:text-xl sm:leading-[1.75]">{item.quote}</blockquote>
        <footer className="mt-auto pt-4">
          <p className="text-[15px] font-medium text-neutral-900">{item.name}</p>
          <p className="text-xs text-neutral-500">{item.role}</p>
        </footer>
      </div>
    </article>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous testimonials" : "Next testimonials"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-[50px] items-center justify-center rounded-xl border bg-white",
        disabled ? "border-neutral-200 text-blue-300" : "border-neutral-300 text-blue-500 hover:bg-blue-50",
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "prev" ? <path d="M19 12H5m6-6-6 6 6 6" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
      </svg>
    </button>
  );
}

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  const [page, setPage] = useState(0);
  if (items.length === 0) return null;
  const pages = Math.ceil(items.length / PER_PAGE);
  // If testimonials were removed while the page was open, never land past the last pair.
  const current = Math.min(page, pages - 1);
  const visible = items.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <SectionHeading title={home.testimonialsIntro.title} subtitle={home.testimonialsIntro.subtitle} />
        <div key={current} className="motion-enter-small grid gap-6 md:grid-cols-2" aria-live="polite">
          {visible.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
        <div className="flex justify-center gap-3">
          <ArrowButton direction="prev" disabled={current === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} />
          <ArrowButton direction="next" disabled={current >= pages - 1} onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} />
        </div>
      </div>
    </section>
  );
}

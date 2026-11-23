"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { href: "/admin/case-studies", label: "Case studies" },
  { href: "/admin/posts", label: "Blog posts" },
];

/** The admin header links. The section you are in (its list, and its new and edit pages) is highlighted. */
export function AdminNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
      <Link href="/admin/case-studies" className="font-serif text-xl text-neutral-950">
        Sach Studio admin
      </Link>
      {SECTIONS.map(({ href, label }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "border-b-2 py-1 transition-colors duration-150",
              current ? "border-blue-500 text-blue-600" : "border-transparent text-neutral-600 hover:text-blue-500",
            )}
          >
            {label}
          </Link>
        );
      })}
      <a href="/" target="_blank" rel="noopener noreferrer" className="py-1 text-neutral-600 hover:text-blue-500">
        View website
      </a>
    </nav>
  );
}

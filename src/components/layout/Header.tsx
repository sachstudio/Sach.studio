"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { isCurrentPath, site } from "@/content/site";

export function Header({ currentPath }: { currentPath?: string }) {
  const routerPath = usePathname();
  const path = currentPath ?? routerPath ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 backdrop-blur-md sm:h-20 sm:px-8">
        <Link href="/" aria-label="Sach Studio home" className="shrink-0">
          <Image
            src="/brand/sach-studio-logo.svg"
            alt="Sach Studio"
            width={180}
            height={50}
            unoptimized
            priority
            className="h-9 w-auto sm:h-[50px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {site.nav.map((link) => {
            const current = isCurrentPath(link.href, path);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  current ? "text-blue-500" : "text-neutral-800 hover:text-blue-500",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-lg text-neutral-800 md:hidden"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="mx-auto mt-2 flex max-w-[1300px] flex-col rounded-2xl border border-neutral-200 bg-white p-2 shadow-card md:hidden"
        >
          {site.nav.map((link) => {
            const current = isCurrentPath(link.href, path);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium",
                  current ? "bg-blue-50 text-blue-500" : "text-neutral-800",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

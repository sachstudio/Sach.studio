"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { isCurrentPath, site } from "@/content/site";

const MOBILE_MENU_ID = "mobile-menu";

export function Header({ currentPath }: { currentPath?: string }) {
  const routerPath = usePathname();
  const path = currentPath ?? routerPath ?? "/";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const expanded = open && !closing;
  const buttonRef = useRef<HTMLButtonElement>(null);

  /** Closing fades the menu out (100ms) before it is removed. */
  function closeMenu() {
    if (!open || closing) return;
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 100);
  }

  /** Opening fades the menu in; closing fades it out. */
  function toggleMenu() {
    if (!open) {
      setOpen(true);
      return;
    }
    closeMenu();
  }

  // Escape closes the open menu and hands focus back to the button, so keyboard users are never stranded.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setClosing(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // The menu is only for phones and small tablets; if the window grows past that, drop it so it does not linger.
  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(min-width: 768px)");
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setOpen(false);
        setClosing(false);
      }
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  return (
    <header className="relative z-30 px-4 pt-4 sm:px-6 sm:pt-10">
      <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-4 backdrop-blur-md sm:h-20 sm:px-8">
        <Link href="/" aria-label="Sach Studio home" className="flex min-h-11 shrink-0 items-center">
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

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex lg:gap-10">
          {site.nav.map((link) => {
            const current = isCurrentPath(link.href, path);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center text-[15px] font-medium",
                  current ? "text-blue-500" : "text-neutral-800 hover:text-blue-500",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={MOBILE_MENU_ID}
          aria-label={expanded ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
          className="-mr-1 flex size-11 items-center justify-center rounded-lg text-neutral-800 md:hidden"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id={MOBILE_MENU_ID}
          aria-label="Mobile"
          className={cn(
            "mx-auto mt-2 flex max-w-[1300px] flex-col rounded-2xl border border-neutral-200 bg-white p-2 shadow-card md:hidden",
            closing ? "motion-exit" : "motion-enter-small",
          )}
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
                  "flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium",
                  current ? "bg-blue-50 text-blue-500" : "text-neutral-800 active:bg-neutral-100",
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

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { breadcrumbsFor } from "@/lib/admin-nav";

/** The card at the top of every admin page: the title on the left, a Home / Section trail on the right. */
export function PageHeader({ title }: { title: string }) {
  const crumbs = breadcrumbsFor(usePathname() ?? "");
  // On an inner page the back button goes up one level: the nearest earlier crumb that is a link.
  const parent = [...crumbs].reverse().find((c) => c.href);

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-[14px] border bg-background px-6 py-5 text-sm">
      <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex items-center gap-3">
          {parent?.href ? (
            <Link
              href={parent.href}
              aria-label={`Back to ${parent.label}`}
              title={`Back to ${parent.label}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <nav aria-label="breadcrumb">
          <ol className="flex items-center whitespace-nowrap">
            <li className="flex items-center">
              <Link href="/admin/case-studies" className="text-sm leading-none text-foreground">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, i) => (
              <Fragment key={`${crumb.label}-${i}`}>
                <li className="mx-2" aria-hidden="true">
                  <div className="p-0.5 text-foreground">/</div>
                </li>
                <li className="flex items-center text-sm leading-none text-foreground">
                  {crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current="page" className="opacity-80">
                      {crumb.label}
                    </span>
                  )}
                </li>
              </Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

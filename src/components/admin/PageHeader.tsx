"use client";

import { usePathname } from "next/navigation";
import { breadcrumbsFor } from "@/lib/admin-nav";
import { PageHeading } from "./PageHeading";

/**
 * The heading of an inner admin page (new, edit, preview): the same heading as the list pages, with a
 * back button that goes up one level, to the nearest earlier page in the trail.
 */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const crumbs = breadcrumbsFor(usePathname() ?? "");
  const parent = [...crumbs].reverse().find((c) => c.href);

  return <PageHeading title={title} subtitle={subtitle} back={parent?.href ? { href: parent.href, label: parent.label } : undefined} />;
}

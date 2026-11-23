"use client";

import { Briefcase, ExternalLink, LayoutDashboard, Newspaper, Rocket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/admin/ui/sidebar";
import { ADMIN_SECTIONS, DASHBOARD_HREF, isCurrentSection, isDashboard } from "@/lib/admin-nav";
import { cn } from "cn";

const ICONS = { "/admin/case-studies": Briefcase, "/admin/posts": Newspaper } as const;

/**
 * The admin's left navigation, laid out like the shadcn dashboard: logo and tag, an uppercase
 * section label, a black pill on the current page, and a progress card at the bottom.
 */
export function AppSidebar({ published, total }: { published: number; total: number }) {
  const pathname = usePathname() ?? "";
  const percent = total === 0 ? 0 : Math.round((published / total) * 100);

  return (
    <Sidebar variant="inset" className="px-0">
      <SidebarHeader className="flex-row items-center justify-between gap-2 px-3 pt-2 pb-4">
        <Link href="/admin/case-studies" aria-label="Sach Studio admin home" className="block max-w-[120px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/sach-studio-logo.svg" alt="" width={100} height={32} className="block h-8 w-auto max-w-[120px]" />
        </Link>
        <Badge variant="secondary">Admin</Badge>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-3 py-4">
        <div className="flex flex-col gap-4">
          <div>
            <span className="mb-2 block text-xs font-semibold text-muted-foreground uppercase">Dashboard</span>
            <div className="py-0.5">
              <Link
                href={DASHBOARD_HREF}
                aria-current={isDashboard(pathname) ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out",
                  isDashboard(pathname) ? "bg-primary font-medium text-background" : "font-normal text-foreground hover:bg-primary/5",
                )}
              >
                <LayoutDashboard className="size-4 shrink-0" />
                <span>Overview</span>
              </Link>
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-semibold text-muted-foreground uppercase">Content</span>
            {ADMIN_SECTIONS.map(({ href, label }) => {
              const current = isCurrentSection(pathname, href);
              const Icon = ICONS[href];
              return (
                <div key={href} className="py-0.5">
                  <Link
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out",
                      current ? "bg-primary font-medium text-background" : "font-normal text-foreground hover:bg-primary/5",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-4">
        <div className="-mx-4 border-y border-border px-5 py-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="size-5 shrink-0" />
                    <span className="text-base leading-6 font-medium text-foreground">Published</span>
                  </div>
                  <span className="text-base leading-6 font-medium text-foreground">{percent}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Case studies published"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10"
                >
                  <div className="h-full rounded-full bg-foreground" style={{ width: `${percent}%` }} />
                </div>
              </div>
              <p className="text-center text-sm leading-5 font-normal text-muted-foreground">
                {published} of {total} case studies are live
              </p>
            </div>
            <Button asChild className="h-9 w-full text-sm font-medium">
              <Link href="/admin/case-studies/new">New case study</Link>
            </Button>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent"
        >
          <ExternalLink className="size-5 shrink-0" />
          <span>View website</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}

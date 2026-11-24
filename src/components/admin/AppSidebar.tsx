"use client";

import { Briefcase, CalendarDays, ExternalLink, LayoutDashboard, Newspaper, Tags, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/admin/ui/badge";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/admin/ui/sidebar";
import { ADMIN_SECTIONS, BOOKING_SECTIONS, DASHBOARD_HREF, PRICING_SECTIONS, isCurrentSection, isDashboard } from "@/lib/admin-nav";
import { cn } from "cn";

const ICONS: Record<string, LucideIcon> = {
  "/admin/case-studies": Briefcase,
  "/admin/posts": Newspaper,
  "/admin/pricing": Tags,
  "/admin/bookings": CalendarDays,
};

type Section = { href: string; label: string };

/** An uppercase group label with its links, the current page shown as a tinted pill. */
function NavGroup({ label, sections, pathname }: { label: string; sections: readonly Section[]; pathname: string }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      {sections.map(({ href, label: name }) => {
        const current = isCurrentSection(pathname, href);
        const Icon = ICONS[href];
        return (
          <div key={href} className="py-0.5">
            <Link
              href={href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out",
                current ? "bg-primary/10 font-medium text-primary" : "font-normal text-foreground hover:bg-primary/5",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{name}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The admin's left navigation, laid out like the shadcn dashboard: logo and tag, an uppercase
 * section label, a tinted pill on the current page, and a link to the website at the bottom.
 */
export function AppSidebar() {
  const pathname = usePathname() ?? "";

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
                  isDashboard(pathname) ? "bg-primary/10 font-medium text-primary" : "font-normal text-foreground hover:bg-primary/5",
                )}
              >
                <LayoutDashboard className="size-4 shrink-0" />
                <span>Overview</span>
              </Link>
            </div>
          </div>
          <NavGroup label="Content" sections={ADMIN_SECTIONS} pathname={pathname} />
          <NavGroup label="Pricing" sections={PRICING_SECTIONS} pathname={pathname} />
          <NavGroup label="Cal.com" sections={BOOKING_SECTIONS} pathname={pathname} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
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

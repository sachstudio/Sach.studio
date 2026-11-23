"use client";

import { UserButton } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { Button } from "@/components/admin/ui/button";
import { Separator } from "@/components/admin/ui/separator";
import { SidebarTrigger } from "@/components/admin/ui/sidebar";

/** The bar above every admin page, like the demo's: sidebar toggle, search, and the corner icons. */
export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <nav className="mx-auto flex flex-wrap items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="size-8 cursor-pointer rounded-full p-2 transition hover:bg-primary/5" />
          <Separator orientation="vertical" className="mr-4 ml-2 max-lg:hidden data-[orientation=vertical]:h-4" />
          <div className="hidden sm:block">
            <AdminSearch />
          </div>
        </div>
        <div className="flex items-center gap-0 sm:gap-1">
          <Button asChild variant="ghost" className="size-10 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary">
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="View website">
              <ExternalLink className="size-5" />
            </a>
          </Button>
          <div className="flex size-10 items-center justify-center">
            <UserButton />
          </div>
        </div>
      </nav>
    </header>
  );
}

"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/admin/ui/input";

/**
 * The search box in the top bar. It searches the list you are working in: blog posts inside the
 * blog section, case studies everywhere else.
 */
export function AdminSearch() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className="relative flex w-full items-center sm:w-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const base = pathname.startsWith("/admin/posts") ? "/admin/posts" : "/admin/case-studies";
        const q = query.trim();
        router.push(q ? `${base}?q=${encodeURIComponent(q)}` : base);
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input type="search" aria-label="Search the admin" placeholder="Search...." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
    </form>
  );
}

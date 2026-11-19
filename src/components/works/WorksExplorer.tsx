"use client";

import { useSearchParams } from "next/navigation";
import { isCategorySlug, type CategorySlug } from "@/lib/categories";
import type { ProjectCardData } from "@/lib/projects";
import { ProjectGrid } from "./ProjectGrid";

/** The Works grid, opened on the category named in `?category=` and keeping the address bar in step. */
export function WorksExplorer({ projects }: { projects: ProjectCardData[] }) {
  const params = useSearchParams();
  const requested = params.get("category") ?? "";
  const initial: CategorySlug | undefined = isCategorySlug(requested) ? requested : undefined;

  function onCategoryChange(category: CategorySlug) {
    const url = new URL(window.location.href);
    url.searchParams.set("category", category);
    window.history.replaceState(null, "", url);
  }

  return <ProjectGrid projects={projects} initialCategory={initial} onCategoryChange={onCategoryChange} />;
}

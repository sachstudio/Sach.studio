"use client";

import { useMemo, useState } from "react";
import { Button, Tabs } from "@/components/ui";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import type { ProjectCardData } from "@/lib/projects";
import { ProjectRowCard, ProjectTileCard } from "./ProjectCard";

type ProjectGridProps = {
  projects: ProjectCardData[];
  initialCategory?: CategorySlug;
  pageSize?: number;
  /** "rows": every card is wide (Works). "featured": first card wide, the rest in a row of tiles (Home). */
  variant?: "rows" | "featured";
  showLoadMore?: boolean;
  onCategoryChange?: (category: CategorySlug) => void;
};

const tabItems = CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));

export function ProjectGrid({
  projects,
  initialCategory = CATEGORIES[0].slug,
  pageSize = 4,
  variant = "rows",
  showLoadMore = true,
  onCategoryChange,
}: ProjectGridProps) {
  const [category, setCategory] = useState<CategorySlug>(initialCategory);
  const [visible, setVisible] = useState(pageSize);

  const inCategory = useMemo(() => projects.filter((p) => p.category === category), [projects, category]);
  const shown = inCategory.slice(0, visible);

  function changeCategory(next: CategorySlug) {
    setCategory(next);
    setVisible(pageSize);
    onCategoryChange?.(next);
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <Tabs items={tabItems} value={category} onChange={changeCategory} label="Project categories" />

      {shown.length === 0 ? (
        <div className="flex w-full max-w-[1300px] flex-col items-center gap-2 rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
          <p className="font-serif text-3xl text-neutral-900">No projects in this category yet</p>
          <p className="text-neutral-600">Choose another category above, or check back soon.</p>
        </div>
      ) : variant === "featured" ? (
        <div className="flex w-full max-w-[1300px] flex-col gap-8">
          <ProjectRowCard project={shown[0]} />
          {shown.length > 1 && (
            <div className="grid gap-8 md:grid-cols-3">
              {shown.slice(1).map((p) => (
                <ProjectTileCard key={p.slug} project={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full max-w-[1300px] flex-col gap-8">
          {shown.map((p) => (
            <ProjectRowCard key={p.slug} project={p} />
          ))}
        </div>
      )}

      {showLoadMore && inCategory.length > visible && (
        <Button variant="outline" onClick={() => setVisible((v) => v + pageSize)} className="h-11 px-6 text-xs">
          Load more
        </Button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Tabs } from "@/components/ui";
import { Reveal } from "@/components/ui/Reveal";
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

const FADE = "28px";

/**
 * On a phone the four category tabs are wider than the screen, so the row scrolls sideways. This keeps the chosen
 * tab in view and fades the edge that still has tabs hidden behind it, so the scroll is visible without a scrollbar.
 */
function useScrollableTabs(selected: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = ref.current?.querySelector<HTMLElement>('[role="tablist"]');
    if (!list) return;

    const update = () => {
      const max = list.scrollWidth - list.clientWidth;
      const start = list.scrollLeft > 4;
      const end = list.scrollLeft < max - 4;
      const mask =
        max <= 1 || (!start && !end)
          ? ""
          : `linear-gradient(to right, ${start ? "transparent" : "#000"} 0, #000 ${FADE}, #000 calc(100% - ${FADE}), ${end ? "transparent" : "#000"} 100%)`;
      list.style.maskImage = mask;
      list.style.setProperty("-webkit-mask-image", mask);
    };

    const chosen = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (chosen && list.scrollWidth > list.clientWidth) {
      const offset = chosen.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollLeft += offset - (list.clientWidth - chosen.offsetWidth) / 2;
    }
    update();

    list.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [selected]);

  return ref;
}

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
  const tabsRef = useScrollableTabs(category);

  const inCategory = useMemo(() => projects.filter((p) => p.category === category), [projects, category]);
  const shown = inCategory.slice(0, visible);

  function changeCategory(next: CategorySlug) {
    setCategory(next);
    setVisible(pageSize);
    onCategoryChange?.(next);
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-12">
      <div ref={tabsRef} className="flex w-full min-w-0 justify-center">
        <Tabs
          items={tabItems}
          value={category}
          onChange={changeCategory}
          label="Project categories"
          className="scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:[&>button]:min-h-11 pointer-coarse:[&>button]:min-h-11"
        />
      </div>

      <Reveal className="w-full max-w-[1300px]">
        {shown.length === 0 ? (
          <div key={category} className="motion-enter-small flex w-full max-w-[1300px] flex-col items-center gap-2 rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
            <p className="font-serif text-3xl text-neutral-900">No projects in this category yet</p>
            <p className="text-neutral-600">Choose another category above, or check back soon.</p>
          </div>
        ) : variant === "featured" ? (
          <div key={category} className="motion-enter-small flex w-full max-w-[1300px] flex-col gap-8">
            <ProjectRowCard project={shown[0]} />
            {shown.length > 1 && (
              <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
                {shown.slice(1).map((p) => (
                  <ProjectTileCard key={p.slug} project={p} likeLeadOnPhones />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div key={category} className="motion-enter-small flex w-full max-w-[1300px] flex-col gap-8">
            {shown.map((p) => (
              <ProjectRowCard key={p.slug} project={p} />
            ))}
          </div>
        )}
      </Reveal>

      {showLoadMore && inCategory.length > visible && (
        <Button variant="outline" onClick={() => setVisible((v) => v + pageSize)} className="h-11 px-6 text-xs">
          Load more
        </Button>
      )}
    </div>
  );
}

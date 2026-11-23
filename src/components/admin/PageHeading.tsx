import type { ReactNode } from "react";

/**
 * The heading block at the top of the demo's "Modern" dashboard page: a title with a line of help under
 * it on the left, and the page's actions (buttons, filters) on the right. No card around it.
 */
export function PageHeading({ title, subtitle, children }: { title: ReactNode; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:gap-0">
        <div className="flex flex-col items-start">
          <h1 className="flex items-center gap-2 text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm font-normal text-muted-foreground">{subtitle}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">{children}</div>}
      </div>
    </div>
  );
}

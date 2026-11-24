import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The heading block at the top of every admin page: a title with a line of help under it on the left,
 * and the page's actions (buttons, filters) on the right. No card around it. Inner pages (new, edit)
 * pass `back` to get an arrow button before the title that goes up one level.
 */
export function PageHeading({
  title,
  subtitle,
  back,
  children,
}: {
  title: ReactNode;
  subtitle?: string;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <div className="pb-4">
      <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:gap-0">
        <div className="flex items-center gap-3">
          {back && (
            <Link
              href={back.href}
              aria-label={`Back to ${back.label}`}
              title={`Back to ${back.label}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          )}
          <div className="flex flex-col items-start">
            <h1 className="flex items-center gap-2 text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm font-normal text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children && <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">{children}</div>}
      </div>
    </div>
  );
}

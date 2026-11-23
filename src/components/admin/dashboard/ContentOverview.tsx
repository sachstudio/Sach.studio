import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import type { CategorySlug } from "@/lib/categories";
import { axisMax, axisTicks, barHeightPercent } from "./chart-math";

type Bar = { slug: CategorySlug; label: string; count: number };

/** Short names under the bars; the full category name stays available as a tooltip. */
const SHORT_LABELS: Record<CategorySlug, string> = {
  websites: "Websites",
  "mobile-apps": "Mobile apps",
  "web-apps-dashboard": "Web apps",
  "logo-branding": "Branding",
};

/** How many case studies are in each category, as a bar chart drawn with plain boxes (no chart library). */
export function ContentOverview({ total, byCategory }: { total: number; byCategory: Bar[] }) {
  const max = axisMax(byCategory.map((b) => b.count));
  const ticks = axisTicks(max).reverse(); // top of the axis first
  const summary = `Case studies by category: ${byCategory.map((b) => `${b.label} ${b.count}`).join(", ")}`;

  return (
    <Card className="h-full gap-0 py-4 shadow-none">
      <CardHeader className="grid-rows-1 gap-0 border-b border-border px-6">
        <CardTitle role="heading" aria-level={2} className="flex items-center gap-2 leading-6">
          <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
          Content overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-1">
          <span className="text-base leading-6 font-normal text-foreground">Case studies</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl leading-8 font-semibold tracking-[-0.3px] text-foreground">{total}</span>
            <span className="text-sm font-normal text-muted-foreground">across the four categories</span>
          </div>
        </div>

        <div role="img" aria-label={summary} className="flex gap-3">
          <div className="flex h-[264px] flex-col justify-between pt-6 pb-0 text-right text-xs leading-none text-muted-foreground tabular-nums" aria-hidden="true">
            {ticks.map((tick, i) => (
              <span key={i} data-testid="axis-tick">
                {tick}
              </span>
            ))}
          </div>
          <div className="flex-1">
            <div className="relative h-[264px]">
              <div className="absolute inset-x-0 top-6 bottom-0" aria-hidden="true">
                {ticks.map((_, i) => (
                  <div key={i} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: `${i * 25}%` }} />
                ))}
                <div className="absolute inset-0 flex">
                  {byCategory.map((bar) => (
                    <div key={bar.slug} className="flex h-full w-1/4 items-end justify-center">
                      <div
                        data-testid={`bar-${bar.slug}`}
                        className="relative w-10 rounded-t-md bg-primary sm:w-14"
                        style={{ height: `${barHeightPercent(bar.count, max)}%` }}
                      >
                        <span data-testid={`bar-count-${bar.slug}`} className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">
                          {bar.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 flex">
              {byCategory.map((bar) => (
                <div key={bar.slug} className="w-1/4 text-center">
                  <span title={bar.label} className="text-sm font-normal text-muted-foreground">
                    {SHORT_LABELS[bar.slug]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

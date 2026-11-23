import { ArrowRight, CircleCheck, Newspaper, PencilLine } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { cn } from "cn";

type Counts = { total: number; published: number; drafts: number };

function StatCard({
  label,
  value,
  badge,
  badgeClass,
  icon,
  href,
  action,
}: {
  label: string;
  value: number;
  badge: string;
  badgeClass: string;
  icon: ReactNode;
  href: string;
  action: string;
}) {
  return (
    <div className="col-span-12 lg:col-span-4">
      <Card data-stat className="h-full shadow-none">
        <CardContent className="flex flex-col items-start gap-4 px-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-foreground">{label}</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold">{value}</h3>
                <span className={cn("inline-flex h-5 items-center rounded-4xl px-2 py-0.5 text-xs font-medium whitespace-nowrap", badgeClass)}>{badge}</span>
              </div>
            </div>
            <div className="w-fit rounded-md border border-border p-2.5 [&_svg]:size-4" aria-hidden="true">
              {icon}
            </div>
          </div>
          <Button asChild variant="outline" className="h-9 gap-1.5 rounded-md px-2.5">
            <Link href={href}>
              {action}
              <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/** The three stat cards under the chart: live case studies, drafts to review, and blog posts. */
export function StatCards({ studies, posts }: { studies: Counts & { percentPublished: number }; posts: Counts }) {
  return (
    <>
      <StatCard
        label="Published case studies"
        value={studies.published}
        badge={`${studies.percentPublished}%`}
        badgeClass="bg-chart-2/10 text-chart-2"
        icon={<CircleCheck />}
        href="/admin/case-studies"
        action="See case studies"
      />
      <StatCard
        label="Case study drafts"
        value={studies.drafts}
        badge={studies.drafts > 0 ? "to review" : "all clear"}
        badgeClass={studies.drafts > 0 ? "bg-chart-5/10 text-chart-5" : "bg-chart-2/10 text-chart-2"}
        icon={<PencilLine />}
        href="/admin/case-studies"
        action="Review drafts"
      />
      <StatCard
        label="Blog posts"
        value={posts.total}
        badge={`${posts.published} live`}
        badgeClass="bg-chart-2/10 text-chart-2"
        icon={<Newspaper />}
        href="/admin/posts"
        action="See posts"
      />
    </>
  );
}

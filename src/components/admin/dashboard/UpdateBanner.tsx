import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { formatEdited } from "@/lib/admin-list";

type Latest = { kind: "Case study" | "Blog post"; title: string; updatedAt: Date };

function draftsSentence(drafts: number) {
  return drafts === 1 ? "1 case study is a draft waiting to be published" : `${drafts} case studies are drafts waiting to be published`;
}

/** The full-width "Update" strip at the top of the dashboard: what changed last, and what is waiting. */
export function UpdateBanner({ latest, drafts }: { latest: Latest | null; drafts: number }) {
  return (
    <Card className="h-full shadow-none">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-1 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-chart-1" />
            </span>
            <p className="text-sm font-medium">Update</p>
            {latest && (
              <>
                <span className="size-1 rounded-full bg-border" aria-hidden="true" />
                <p className="text-sm font-normal text-muted-foreground">{formatEdited(latest.updatedAt)}</p>
              </>
            )}
          </div>
          {latest ? (
            <>
              <p className="truncate text-sm font-normal">
                {`Last edited: ${latest.title} (${latest.kind})`}
                {drafts > 0 && <span className="text-muted-foreground">{` ? ${draftsSentence(drafts)}`}</span>}
              </p>
            </>
          ) : (
            <p className="text-sm font-normal">Nothing here yet. Add your first case study to get started.</p>
          )}
        </div>
        <Button asChild variant="outline" className="h-9 gap-1.5 rounded-md px-2.5">
          <Link href="/admin/case-studies">
            See case studies
            <ArrowRight />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

import { cn } from "cn";

const pill = "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal whitespace-nowrap";

/** Status pills like the demo's: a 10% tint of the colour behind text in that colour. */
export function StatusBadge({ status, needsContent }: { status: "draft" | "published"; needsContent?: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={cn(pill, status === "published" ? "bg-chart-2/10 text-chart-2" : "bg-muted-foreground/10 text-muted-foreground")}>
        {status === "published" ? "Published" : "Draft"}
      </span>
      {needsContent && <span className={cn(pill, "bg-chart-5/10 text-chart-5")}>Needs content</span>}
    </span>
  );
}

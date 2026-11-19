import { cn } from "@/lib/cn";

export function StatusBadge({ status, needsContent }: { status: "draft" | "published"; needsContent?: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded-md px-2 py-0.5 text-xs font-medium",
          status === "published" ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-700",
        )}
      >
        {status === "published" ? "Published" : "Draft"}
      </span>
      {needsContent && (
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Needs content</span>
      )}
    </span>
  );
}

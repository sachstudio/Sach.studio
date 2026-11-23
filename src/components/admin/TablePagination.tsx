"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useId } from "react";
import { NativeSelect } from "@/components/admin/ui/native-select";
import { pageNumbers } from "@/lib/admin-list";
import { cn } from "cn";

type Props = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizes?: number[];
};

/** The strip under a table, like the demo's: "Show 10 per page" on the left, the range and page buttons on the right. */
export function TablePagination({ total, page, pageSize, onPageChange, onPageSizeChange, pageSizes = [10, 25, 50] }: Props) {
  const selectId = useId();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const arrow = "flex size-8 cursor-pointer items-center justify-center rounded-md hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-inherit";

  return (
    <div className="flex flex-col gap-3 bg-background px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Show</p>
        <NativeSelect id={selectId} aria-label="Rows per page" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="w-16">
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </NativeSelect>
        <p className="text-sm text-muted-foreground">per page</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-normal text-muted-foreground tabular-nums">{total === 0 ? "0 of 0" : `${from}-${to} of ${total}`}</p>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={arrow}>
            <ArrowLeft className="size-4" />
          </button>
          {pageNumbers(page, pageCount).map((p, i) =>
            p === null ? (
              <span key={`gap-${i}`} aria-hidden="true" className="flex h-8 w-6 items-center justify-center text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
                className={cn(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm font-normal",
                  p === page ? "bg-primary/5 text-primary" : "hover:bg-primary/5 hover:text-primary",
                )}
              >
                {p}
              </button>
            ),
          )}
          <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className={arrow}>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

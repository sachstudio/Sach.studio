"use client";

import { ArrowDownUp, Briefcase, EllipsisVertical, ExternalLink, Eye, Pencil, Plus, RefreshCcw, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListFilterSelect } from "@/components/admin/ListFilterSelect";
import { PageHeading } from "@/components/admin/PageHeading";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TablePagination } from "@/components/admin/TablePagination";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/admin/ui/dropdown-menu";
import { Input } from "@/components/admin/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { countByCategory, filterByCategory, filterByQuery, paginate, sortRows, type CategoryFilter } from "@/lib/admin-list";
import { CATEGORIES, categoryLabel, type CategorySlug } from "@/lib/categories";

export type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  category: CategorySlug;
  status: "draft" | "published";
  isPlaceholder: boolean;
  cardImageUrl: string;
  /** Already formatted on the server, so the server and browser never disagree about the date. */
  edited: string;
  /** The real date (ISO), used to sort the Edited column. */
  editedAt: string;
};

type SortKey = "title" | "category" | "status" | "edited";
type Sort = { key: SortKey | null; dir: "asc" | "desc" };

const SORT_KEYS: Record<SortKey, (row: CaseStudyRow) => string | number> = {
  title: (r) => r.title,
  category: (r) => categoryLabel(r.category),
  status: (r) => r.status,
  edited: (r) => Date.parse(r.editedAt),
};

// Header cells like the demo's Modern table: light, regular weight, with a small sort arrow.
const th = "h-auto px-2 py-3 text-left text-sm font-normal text-muted-foreground";

function SortHeader({ label, sortKey, sort, onSort, className }: { label: string; sortKey: SortKey; sort: Sort; onSort: (key: SortKey) => void; className?: string }) {
  const active = sort.key === sortKey;
  return (
    <TableHead className={`${th} ${className ?? ""}`} aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => onSort(sortKey)} className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap select-none">
        {label}
        <ArrowDownUp className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>
    </TableHead>
  );
}

function Thumbnail({ src, title }: { src: string; title: string }) {
  return (
    <div className="flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${title} card image`} loading="lazy" className="size-full object-cover" />
      ) : (
        <span className="text-xs text-muted-foreground">No image</span>
      )}
    </div>
  );
}

/** The Case studies page, laid out like the demo's Modern dashboard: a heading block, then one table card. */
export function CaseStudyTable({ rows, initialQuery = "" }: { rows: CaseStudyRow[]; initialQuery?: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const counts = countByCategory(rows);
  const matching = filterByQuery(filterByCategory(rows, filter), query, (r) => [r.title, r.slug]);
  const sorted = sortRows(matching, sort.key ? SORT_KEYS[sort.key] : null, sort.dir);
  const view = paginate(sorted, page, pageSize);

  const filterOptions = [
    { value: "all", label: `All categories (${counts.all})` },
    ...CATEGORIES.map((c) => ({ value: c.slug, label: `${c.label} (${counts[c.slug]})` })),
  ];

  const emptyText =
    rows.length === 0
      ? "No case studies yet. Add the first one with New case study."
      : query.trim()
        ? `No case studies match “${query.trim()}”.`
        : `No case studies in ${filter === "all" ? "this view" : categoryLabel(filter)} yet.`;

  function onSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
    setPage(1);
  }

  return (
    <>
      <PageHeading title="Case studies" subtitle="The projects shown on your Works page">
        <Button type="button" variant="outline" aria-label="Refresh" onClick={() => router.refresh()} className="h-9 w-[38px] rounded-lg p-0">
          <RefreshCcw />
        </Button>
        <ListFilterSelect
          label="Filter by category"
          value={filter}
          options={filterOptions}
          onChange={(value) => {
            setFilter(value as CategoryFilter);
            setPage(1);
          }}
        />
        <Button asChild className="h-auto gap-1.5 rounded-lg px-2.5 py-2">
          <Link href="/admin/case-studies/new">
            <Plus />
            <span className="text-sm font-medium">New case study</span>
          </Link>
        </Button>
      </PageHeading>

      <Card className="gap-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 pb-4">
          <div className="flex items-center gap-2 text-base leading-6 font-medium">
            <Briefcase className="size-4 text-foreground" aria-hidden="true" />
            <span>Case studies</span>
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              aria-label="Search case studies"
              placeholder="Search by title or address"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <Table aria-label="Case studies" className="[&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <SortHeader label="Title" sortKey="title" sort={sort} onSort={onSort} />
                  <SortHeader label="Category" sortKey="category" sort={sort} onSort={onSort} className="w-[220px]" />
                  <SortHeader label="Status" sortKey="status" sort={sort} onSort={onSort} className="w-[190px]" />
                  <SortHeader label="Edited" sortKey="edited" sort={sort} onSort={onSort} className="w-[130px]" />
                  <TableHead className={`${th} w-[48px]`}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {view.items.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                      {emptyText}
                    </TableCell>
                  </TableRow>
                ) : (
                  view.items.map((row) => (
                    <TableRow key={row.id} className="border-b border-border hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Thumbnail src={row.cardImageUrl} title={row.title} />
                          <div className="flex min-w-0 max-w-[420px] flex-col leading-5">
                            <Link href={`/admin/case-studies/${row.id}`} title={row.title} className="truncate text-sm font-medium text-foreground hover:text-primary">
                              {row.title}
                            </Link>
                            <span className="truncate text-sm font-normal text-muted-foreground">/works/{row.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-normal text-muted-foreground">{categoryLabel(row.category)}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} needsContent={row.isPlaceholder} />
                      </TableCell>
                      <TableCell className="text-sm font-normal text-muted-foreground">{row.edited}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${row.title}`}>
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/case-studies/${row.id}`}>
                                <Pencil /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/admin/case-studies/${row.id}/preview`} target="_blank" rel="noopener noreferrer">
                                <Eye /> Preview
                              </a>
                            </DropdownMenuItem>
                            {row.status === "published" && (
                              <DropdownMenuItem asChild>
                                <a href={`/works/${row.slug}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink /> View live page
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <TablePagination
          total={view.total}
          page={view.page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
    </>
  );
}

"use client";

import { CircleHelp, Pencil, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeading } from "@/components/admin/PageHeading";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { FAQ_PAGES, faqPageLabel, type FaqPage } from "@/lib/faq-pages";
import { cn } from "cn";

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  pages: string[];
  status: "draft" | "published";
  position: number;
};

const th = "h-auto px-2 py-3 text-left text-sm font-normal text-muted-foreground";

/** The FAQs page: every question, with the pages of the website it shows on, and a filter to look at one page at a time. */
export function FaqTable({ rows }: { rows: FaqRow[] }) {
  const router = useRouter();
  const [page, setPage] = useState<FaqPage | "all">("all");

  const count = (p: FaqPage | "all") => (p === "all" ? rows.length : rows.filter((r) => r.pages.includes(p)).length);
  const shown = page === "all" ? rows : rows.filter((r) => r.pages.includes(page));
  const filters: { value: FaqPage | "all"; label: string }[] = [{ value: "all", label: "All pages" }, ...FAQ_PAGES.map((p) => ({ value: p.value, label: p.label }))];

  return (
    <>
      <PageHeading title="FAQs" subtitle="The questions and answers on your website pages">
        <Button type="button" variant="outline" aria-label="Refresh" onClick={() => router.refresh()} className="h-9 w-[38px] rounded-lg p-0">
          <RefreshCcw />
        </Button>
        <Button asChild className="h-auto gap-1.5 rounded-lg px-2.5 py-2">
          <Link href="/admin/faqs/new">
            <Plus />
            <span className="text-sm font-medium">New FAQ</span>
          </Link>
        </Button>
      </PageHeading>

      <Card className="gap-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 pb-4">
          <div className="flex items-center gap-2 text-base leading-snug font-medium">
            <CircleHelp className="size-4 text-foreground" aria-hidden="true" />
            <span>{page === "all" ? "All FAQs" : `FAQs on the ${faqPageLabel(page)}`}</span>
          </div>
          <div role="group" aria-label="Show FAQs from" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f.value}
                type="button"
                size="sm"
                variant={page === f.value ? "default" : "outline"}
                aria-pressed={page === f.value}
                onClick={() => setPage(f.value)}
                className="gap-2 rounded-lg"
              >
                {f.label}
                <span className={cn("text-xs tabular-nums", page === f.value ? "opacity-80" : "text-muted-foreground")}>{count(f.value)}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <Table aria-label="FAQs" className="[&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className={th}>Question</TableHead>
                  <TableHead className={th}>Shown on</TableHead>
                  <TableHead className={th}>On website</TableHead>
                  <TableHead className={th}>Position</TableHead>
                  <TableHead className={`${th} w-[48px]`}>
                    <span className="sr-only">Edit</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                      {rows.length === 0
                        ? "No FAQs yet. Add the first one with New FAQ."
                        : page === "all"
                          ? "No FAQs to show."
                          : `No FAQs on the ${faqPageLabel(page)} yet. Add one, or tick this page on an existing FAQ.`}
                    </TableCell>
                  </TableRow>
                ) : (
                  shown.map((row) => (
                    <TableRow key={row.id} className="border-b border-border hover:bg-muted/30">
                      <TableCell>
                        <div className="flex min-w-0 max-w-[440px] flex-col leading-5">
                          <Link href={`/admin/faqs/${row.id}`} className="truncate text-sm font-medium hover:text-primary">
                            {row.question}
                          </Link>
                          <span className="truncate text-sm text-muted-foreground">{row.answer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {row.pages.map((p) => (
                            <span key={p} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal whitespace-nowrap text-primary">
                              {faqPageLabel(p)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-normal whitespace-nowrap",
                            row.status === "published" ? "bg-chart-2/10 text-chart-2" : "bg-muted-foreground/10 text-muted-foreground",
                          )}
                        >
                          {row.status === "published" ? "Shown" : "Hidden"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.position}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="icon" aria-label={`Edit ${row.question}`}>
                          <Link href={`/admin/faqs/${row.id}`}>
                            <Pencil />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </>
  );
}

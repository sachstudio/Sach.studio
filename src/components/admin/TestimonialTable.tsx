"use client";

import { MessageSquareQuote, Pencil, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeading } from "@/components/admin/PageHeading";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { cn } from "cn";

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  tag: string;
  quote: string;
  avatarUrl: string;
  status: "draft" | "published";
  position: number;
};

const th = "h-auto px-2 py-3 text-left text-sm font-normal text-muted-foreground";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The Testimonials page: the client quotes in the home page's "What our clients say" section, in the order visitors see them. */
export function TestimonialTable({ rows }: { rows: TestimonialRow[] }) {
  const router = useRouter();

  return (
    <>
      <PageHeading title="Testimonials" subtitle="What clients say about you on your home page">
        <Button type="button" variant="outline" aria-label="Refresh" onClick={() => router.refresh()} className="h-9 w-[38px] rounded-lg p-0">
          <RefreshCcw />
        </Button>
        <Button asChild className="h-auto gap-1.5 rounded-lg px-2.5 py-2">
          <Link href="/admin/testimonials/new">
            <Plus />
            <span className="text-sm font-medium">New testimonial</span>
          </Link>
        </Button>
      </PageHeading>

      <Card className="gap-0">
        <div className="flex items-center gap-2 border-b border-border px-6 pb-4 text-base leading-snug font-medium">
          <MessageSquareQuote className="size-4 text-foreground" aria-hidden="true" />
          <span>All testimonials</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <Table aria-label="Testimonials" className="[&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className={th}>Client</TableHead>
                  <TableHead className={th}>Quote</TableHead>
                  <TableHead className={th}>Label</TableHead>
                  <TableHead className={th}>On website</TableHead>
                  <TableHead className={th}>Position</TableHead>
                  <TableHead className={`${th} w-[48px]`}>
                    <span className="sr-only">Edit</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                      No testimonials yet. Add the first one with New testimonial.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="border-b border-border hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {row.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={row.avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                          ) : (
                            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                              {initials(row.name)}
                            </span>
                          )}
                          <div className="flex min-w-0 max-w-[240px] flex-col leading-5">
                            <Link href={`/admin/testimonials/${row.id}`} className="truncate text-sm font-medium hover:text-primary">
                              {row.name}
                            </Link>
                            <span className="truncate text-sm text-muted-foreground">{row.role}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-[320px] truncate text-sm text-muted-foreground">{row.quote}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.tag}</TableCell>
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
                        <Button asChild variant="ghost" size="icon" aria-label={`Edit ${row.name}`}>
                          <Link href={`/admin/testimonials/${row.id}`}>
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

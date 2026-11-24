"use client";

import { CalendarDays, RefreshCcw, Search, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeading } from "@/components/admin/PageHeading";
import { TablePagination } from "@/components/admin/TablePagination";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import { filterByQuery, paginate } from "@/lib/admin-list";
import { cn } from "cn";

export type BookingRow = {
  id: string;
  name: string;
  email: string;
  /** Already formatted on the server, in the studio's time zone. */
  when: string;
  /** The real date (ISO). */
  whenAt: string;
  timezone: string;
  status: "confirmed" | "requested" | "cancelled" | "rejected" | "rescheduled";
  notes: string;
  meetingUrl: string;
};

const STATUS: Record<BookingRow["status"], { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-chart-2/10 text-chart-2" },
  requested: { label: "Needs approval", className: "bg-chart-5/10 text-chart-5" },
  cancelled: { label: "Cancelled", className: "bg-muted-foreground/10 text-muted-foreground" },
  rescheduled: { label: "Rescheduled", className: "bg-muted-foreground/10 text-muted-foreground" },
  rejected: { label: "Declined", className: "bg-destructive/10 text-destructive" },
};

const th = "h-auto px-2 py-3 text-left text-sm font-normal text-muted-foreground";
const code = "rounded bg-muted px-1.5 py-0.5 text-foreground";

function SetupSteps({ webhookUrl }: { webhookUrl: string }) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-2 text-sm">
        <p className="font-medium">Connect Cal.com so bookings show up here</p>
        <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>
            In Cal.com, open Settings, Developer, Webhooks and add a webhook with this address: <code className={code}>{webhookUrl}</code>
          </li>
          <li>Tick Booking Created, Rescheduled, Cancelled, Requested and Rejected, and type a secret of your choice.</li>
          <li>
            Save the same secret as <code className={code}>CAL_WEBHOOK_SECRET</code> in your Vercel project settings, then redeploy.
          </li>
        </ol>
      </CardContent>
    </Card>
  );
}

/** The Cal.com > Booking page: every call booked through the website, newest first. */
export function BookingTable({ rows, setup }: { rows: BookingRow[]; setup: { webhookUrl: string; secretSet: boolean } }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const matching = filterByQuery(rows, query, (r) => [r.name, r.email, r.notes, STATUS[r.status].label]);
  const view = paginate(matching, page, pageSize);
  const emptyText = rows.length === 0 ? "No bookings yet. New calls booked on the website will appear here." : `No bookings match “${query.trim()}”.`;

  return (
    <>
      <PageHeading title="Booking" subtitle="Calls booked through the Cal.com widget on your website">
        <Button type="button" variant="outline" aria-label="Refresh" onClick={() => router.refresh()} className="h-9 w-[38px] rounded-lg p-0">
          <RefreshCcw />
        </Button>
      </PageHeading>

      {!setup.secretSet && <SetupSteps webhookUrl={setup.webhookUrl} />}

      <Card className="gap-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 pb-4">
          <div className="flex items-center gap-2 text-base leading-snug font-medium">
            <CalendarDays className="size-4 text-foreground" aria-hidden="true" />
            <span>All bookings</span>
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              aria-label="Search bookings"
              placeholder="Search by name or email"
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
          <div className="min-w-[900px]">
            <Table aria-label="Bookings" className="[&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className={th}>Name</TableHead>
                  <TableHead className={th}>Call time</TableHead>
                  <TableHead className={th}>Their time zone</TableHead>
                  <TableHead className={th}>Status</TableHead>
                  <TableHead className={th}>Notes</TableHead>
                  <TableHead className={th}>Meeting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {view.items.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                      {emptyText}
                    </TableCell>
                  </TableRow>
                ) : (
                  view.items.map((row) => (
                    <TableRow key={row.id} className="border-b border-border hover:bg-muted/30">
                      <TableCell>
                        <div className="flex min-w-0 flex-col leading-5">
                          <span className="text-sm font-medium">{row.name || "Unknown"}</span>
                          {row.email && (
                            <a href={`mailto:${row.email}`} className="truncate text-sm text-muted-foreground hover:text-primary">
                              {row.email}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{row.when}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.timezone || "-"}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-normal whitespace-nowrap", STATUS[row.status].className)}>
                          {STATUS[row.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[260px] text-sm whitespace-normal text-muted-foreground">{row.notes || "-"}</TableCell>
                      <TableCell>
                        {row.meetingUrl ? (
                          <a href={row.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary">
                            <Video className="size-4" aria-hidden="true" />
                            Join call
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
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

import { ArrowDownUp, Briefcase } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table";
import type { RecentItem } from "@/lib/admin-dashboard";
import { formatEdited } from "@/lib/admin-list";
import { cn } from "cn";

const th = "h-auto px-2 py-3 text-sm font-normal text-muted-foreground";

function StatusPill({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal whitespace-nowrap",
        status === "published" ? "bg-chart-2/10 text-chart-2" : "bg-muted-foreground/10 text-muted-foreground",
      )}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      {children}
      <ArrowDownUp className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

/** The last few things you edited, case studies and blog posts together, in the demo's "Projects & Orders" table style. */
export function RecentTable({ items }: { items: RecentItem[] }) {
  return (
    <Card className="h-full gap-0 py-4 shadow-none">
      <CardHeader className="grid-rows-1 gap-0 border-b border-border px-6">
        <CardTitle role="heading" aria-level={2} className="flex items-center gap-2 leading-6">
          <Briefcase className="size-4 text-foreground" aria-hidden="true" />
          Recently edited
        </CardTitle>
      </CardHeader>
      <Table aria-label="Recently edited" className="min-w-[520px] [&_th:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:first-child]:pl-4 [&_td:last-child]:pr-4">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className={th}>
              <Heading>Title</Heading>
            </TableHead>
            <TableHead className={cn(th, "w-[140px]")}>
              <Heading>Status</Heading>
            </TableHead>
            <TableHead className={cn(th, "w-[140px]")}>
              <Heading>Edited</Heading>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow className="border-border hover:bg-transparent">
              <TableCell colSpan={3} className="h-32 px-4 text-center text-sm font-normal text-muted-foreground">
                Nothing has been edited yet.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={`${item.kind}-${item.id}`} className="border-border hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col leading-5">
                    <Link href={item.href} className="text-sm font-medium whitespace-nowrap text-foreground hover:text-primary">
                      {item.title}
                    </Link>
                    <span className="text-sm font-normal whitespace-nowrap text-muted-foreground">{item.kind}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill status={item.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-normal whitespace-nowrap text-muted-foreground">{formatEdited(item.updatedAt)}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

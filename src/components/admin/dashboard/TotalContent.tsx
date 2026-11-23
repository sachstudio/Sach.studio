import { Box, Briefcase, CircleCheck, Newspaper, PencilLine } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

type Counts = { total: number; published: number; drafts: number };

function Tile({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div data-tile className="flex flex-col justify-between gap-6 bg-background p-6">
      <div className="w-fit rounded-md border border-border p-2 [&_svg]:size-4" aria-hidden="true">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-semibold">{value}</h3>
        <p className="text-sm font-normal">{label}</p>
      </div>
    </div>
  );
}

/** The 2x2 grid of totals: case studies, blog posts, and how many of everything is live or waiting. */
export function TotalContent({ studies, posts }: { studies: Counts; posts: Counts }) {
  return (
    <Card className="h-full gap-0 py-4 shadow-none">
      <CardHeader className="grid-rows-1 gap-0 border-b border-border px-6">
        <CardTitle role="heading" aria-level={2} className="flex items-center gap-2 leading-6">
          <Box className="size-4 text-muted-foreground" aria-hidden="true" />
          Total content
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full px-0">
        <div className="grid h-full grid-cols-2 gap-px bg-border">
          <Tile icon={<Briefcase />} value={studies.total} label="Case studies" />
          <Tile icon={<Newspaper />} value={posts.total} label="Blog posts" />
          <Tile icon={<CircleCheck />} value={studies.published + posts.published} label="Published" />
          <Tile icon={<PencilLine />} value={studies.drafts + posts.drafts} label="Drafts" />
        </div>
      </CardContent>
    </Card>
  );
}

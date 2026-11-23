import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/admin/PageHeading";
import { Button } from "@/components/admin/ui/button";
import type { buildDashboard } from "@/lib/admin-dashboard";
import { ContentOverview } from "./ContentOverview";
import { RecentTable } from "./RecentTable";
import { RefreshButton } from "./RefreshButton";
import { StatCards } from "./StatCards";
import { TotalContent } from "./TotalContent";
import { UpdateBanner } from "./UpdateBanner";

/** The admin home page, laid out like the demo's "Modern" dashboard but filled with your own content numbers. */
export function Dashboard({ data, greeting, name }: { data: ReturnType<typeof buildDashboard>; greeting: string; name: string }) {
  return (
    <>
      <PageHeading title={`${greeting}, ${name}`} subtitle="Here is what is on your website today">
        <RefreshButton />
        <Button asChild className="h-auto gap-1.5 rounded-lg px-2.5 py-2">
          <Link href="/admin/case-studies/new">
            <Plus />
            <span className="text-sm font-medium">New case study</span>
          </Link>
        </Button>
      </PageHeading>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <UpdateBanner latest={data.latest} drafts={data.studies.drafts} />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <ContentOverview total={data.studies.total} byCategory={data.byCategory} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <TotalContent studies={data.studies} posts={data.posts} />
        </div>
        <StatCards studies={data.studies} posts={data.posts} />
        <div className="col-span-12">
          <RecentTable items={data.recent} />
        </div>
      </div>
    </>
  );
}

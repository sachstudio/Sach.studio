"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/ui/button";

/** The outlined icon button beside the dashboard's heading: reloads the page's numbers. */
export function RefreshButton() {
  const router = useRouter();
  return (
    <Button type="button" variant="outline" aria-label="Refresh" onClick={() => router.refresh()} className="h-9 w-[38px] cursor-pointer rounded-lg p-0">
      <RefreshCcw />
    </Button>
  );
}

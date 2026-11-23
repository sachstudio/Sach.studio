import Link from "next/link";
import { Button } from "@/components/admin/ui/button";

/** The row under a form, like the demo's "Save changes / Cancel". Saving always stays clickable; a repeat click while saving is ignored. */
export function FormActions({ published, pending, cancelHref }: { published: boolean; pending: boolean; cancelHref: string }) {
  return (
    <div className="flex gap-3">
      <Button type="submit" aria-busy={pending} className="w-fit">
        {published ? "Save changes" : "Save draft"}
      </Button>
      <Button asChild variant="outline">
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}

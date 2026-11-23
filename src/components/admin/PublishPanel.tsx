"use client";

import { ExternalLink, Eye, Loader2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { cn } from "cn";

type Props = {
  /** "case study" or "post": used in the delete question. */
  entity: string;
  entityTitle: string;
  status: "draft" | "published";
  needsContent: boolean;
  /** True once the item exists, so it can be previewed, unpublished or deleted. */
  saved: boolean;
  pending: boolean;
  previewHref?: string;
  liveHref?: string;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onConfirmingDeleteChange: (open: boolean) => void;
};

/** The "Status" card beside a form, like the demo's Blog Status: a coloured dot, and the buttons that publish or remove the item. */
export function PublishPanel({
  entity,
  entityTitle,
  status,
  needsContent,
  saved,
  pending,
  previewHref,
  liveHref,
  onPublish,
  onUnpublish,
  onDelete,
  confirmingDelete,
  onConfirmingDeleteChange,
}: Props) {
  const published = status === "published";

  return (
    <Card>
      <CardHeader>
        <CardTitle role="heading" aria-level={2} className="flex items-center justify-between">
          Status
          <span aria-hidden="true" className={cn("size-3 rounded-full p-0", published ? "bg-chart-2" : "bg-muted-foreground/50")} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StatusBadge status={status} needsContent={needsContent} />
          <small className="text-xs text-muted-foreground">{published ? "This is live on the website." : "Not on the website until you publish it."}</small>
        </div>

        <div className="flex flex-col gap-2">
          {!published && (
            <Button type="button" onClick={onPublish} aria-busy={pending} className="w-full">
              Publish
            </Button>
          )}
          {published && saved && (
            <Button type="button" variant="outline" onClick={onUnpublish} aria-busy={pending} className="w-full">
              Unpublish
            </Button>
          )}
          {pending && (
            <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Working…
            </p>
          )}
        </div>

        {(previewHref || liveHref) && (
          <div className="flex flex-col gap-1 border-t border-border pt-3">
            {previewHref && (
              <Button asChild variant="ghost" className="justify-start hover:bg-primary/5 hover:text-primary">
                <a href={previewHref} target="_blank" rel="noopener noreferrer">
                  <Eye /> Preview
                </a>
              </Button>
            )}
            {liveHref && (
              <Button asChild variant="ghost" className="justify-start hover:bg-primary/5 hover:text-primary">
                <a href={liveHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink /> View live page
                </a>
              </Button>
            )}
          </div>
        )}

        {saved && (
          <div className="border-t border-border pt-3">
            <Button type="button" variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => onConfirmingDeleteChange(true)}>
              <Trash2 /> Delete
            </Button>
          </div>
        )}
      </CardContent>

      <AlertDialog open={confirmingDelete} onOpenChange={onConfirmingDeleteChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {entity} “{entityTitle || "Untitled"}”?
            </AlertDialogTitle>
            <AlertDialogDescription>It will be removed from the website and this cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={onDelete}>
              Delete {entity}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

import { updateTag } from "next/cache";

/**
 * Refresh cached public content right away. Must be called from a server action, so the admin
 * sees the change immediately and the next visitor gets the updated page.
 */
export function revalidateContent(tags: string[]): void {
  for (const tag of new Set(tags)) updateTag(tag);
}

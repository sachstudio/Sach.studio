import { forbidden, redirect } from "next/navigation";
import { requireAdmin } from "./admin-auth";

/**
 * Call this first in every admin page and layout. Signed-out visitors go to the sign-in page; a
 * signed-in user who is not on the allowlist gets a 403. Pages must call it themselves: Next.js does
 * not re-run a shared layout when a visitor navigates inside it, so a layout-only check can be skipped.
 */
export async function gateAdmin(): Promise<{ userId: string; email: string }> {
  try {
    return await requireAdmin();
  } catch (error) {
    const e = error as { name?: string; kind?: string };
    if (e?.name === "AdminAuthError") {
      if (e.kind === "unauthenticated") redirect("/admin/sign-in");
      forbidden();
    }
    throw error;
  }
}

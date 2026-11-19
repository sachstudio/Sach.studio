import { auth, currentUser } from "@clerk/nextjs/server";

export class AdminAuthError extends Error {
  readonly kind: "unauthenticated" | "forbidden";

  constructor(kind: "unauthenticated" | "forbidden") {
    super(kind === "unauthenticated" ? "Sign in to continue" : "Not authorised");
    this.name = "AdminAuthError";
    this.kind = kind;
  }
}

/** True when `email` is on the comma-separated `ADMIN_EMAILS` list. An empty list admits nobody. */
export function isAdminEmail(email: string | null | undefined, allowlist: string | undefined = process.env.ADMIN_EMAILS): boolean {
  if (!email) return false;
  const allowed = (allowlist ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/**
 * Gate for every admin page, server action and admin API route.
 * Throws AdminAuthError: "unauthenticated" when nobody is signed in, "forbidden" when the
 * signed-in user's email is not on the allowlist.
 */
export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const { userId } = await auth();
  if (!userId) throw new AdminAuthError("unauthenticated");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email || !isAdminEmail(email)) throw new AdminAuthError("forbidden");
  return { userId, email };
}

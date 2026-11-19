import { UserButton } from "@clerk/nextjs";
import { forbidden, redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

/** Every page below this layout needs a signed-in admin: signed-out goes to sign-in, others get a 403. */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    const kind = (error as { name?: string; kind?: string })?.name === "AdminAuthError" ? (error as { kind: string }).kind : null;
    if (kind === "unauthenticated") redirect("/admin/sign-in");
    if (kind === "forbidden") forbidden();
    throw error;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <nav aria-label="Admin" className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="font-serif text-xl text-neutral-950">
              Sach Studio admin
            </Link>
            <Link href="/admin" className="text-neutral-600 hover:text-blue-500">
              Dashboard
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-blue-500">
              View website
            </a>
          </nav>
          <UserButton />
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { gateAdmin } from "@/lib/admin-gate";

/**
 * Admin chrome. Each page also calls gateAdmin() itself: a layout is not re-run when a visitor
 * navigates between pages inside it, so this check alone would not be enough.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await gateAdmin();

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

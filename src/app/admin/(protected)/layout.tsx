import { UserButton } from "@clerk/nextjs";
import { AdminNav } from "@/components/admin/AdminNav";
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
          <AdminNav />
          <UserButton />
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

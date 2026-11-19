import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: { absolute: "Sach Studio admin" },
  robots: { index: false, follow: false },
};

async function AdminProviders({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

/**
 * Everything under /admin is per-visitor, so it renders at request time behind this boundary.
 * Clerk is only loaded here, never on the public pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-10 text-neutral-500">Loading the admin…</p>}>
      <AdminProviders>{children}</AdminProviders>
    </Suspense>
  );
}

import { Geist } from "next/font/google";
import Link from "next/link";
import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/admin/ui/sidebar";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";

// The admin uses Geist, like the shadcn dashboard it is modelled on. The public site keeps its own fonts.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

/**
 * Admin chrome, laid out like the shadcn dashboard's "inset" style: the sidebar colour sits behind a
 * rounded white card that holds the top bar and the page. Each page also calls gateAdmin() itself:
 * a layout is not re-run when a visitor navigates between pages inside it, so this check alone would
 * not be enough.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const studies = await (await getRepo()).adminListCaseStudies();
  const published = studies.filter((s) => s.status === "published").length;

  return (
    <div
      className={`${geist.variable} admin-root text-foreground antialiased`}
      style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif", fontWeight: 400 }}
    >
      {/* Menus and dialogs render outside this wrapper, so give the page body the admin's font and weight too
          (the public site's body is Outfit at weight 300). Only applies while an admin page is open. */}
      <style>{`body:has(.admin-root){font-family:${geist.style.fontFamily},ui-sans-serif,system-ui,sans-serif;font-weight:400}`}</style>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar published={published} total={studies.length} />
          <SidebarInset className="min-w-0 overflow-clip border border-border md:peer-data-[variant=inset]:rounded-[14px] md:peer-data-[variant=inset]:shadow-sm">
            <AdminHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="container mx-auto w-full">
                <main className="min-h-[calc(100vh-140px)]">
                  <div>{children}</div>
                </main>
                <div className="pt-6">
                  <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row">
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Sach Studio</p>
                    <div className="flex gap-4">
                      <Link href="/admin/case-studies" className="text-sm text-muted-foreground hover:text-primary">
                        Case studies
                      </Link>
                      <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-primary">
                        Blog posts
                      </Link>
                      <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                        View website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies", push: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push }),
}));
vi.mock("@clerk/nextjs", () => ({ UserButton: () => <button type="button">Account menu</button> }));

import { SidebarProvider } from "@/components/admin/ui/sidebar";
import { AdminHeader } from "./AdminHeader";

function renderHeader(pathname: string) {
  nav.pathname = pathname;
  return render(
    <SidebarProvider>
      <AdminHeader />
    </SidebarProvider>,
  );
}

beforeEach(() => nav.push.mockClear());

describe("AdminHeader", () => {
  it("has a button that opens and closes the sidebar", () => {
    renderHeader("/admin/case-studies");
    expect(screen.getByRole("button", { name: "Toggle Sidebar" })).toBeInTheDocument();
  });

  it("keeps a link to the public site and the account menu in the corner", () => {
    renderHeader("/admin/posts");
    expect(screen.getByRole("link", { name: "View website" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Account menu" })).toBeInTheDocument();
  });

  describe("search", () => {
    it("searches case studies from anywhere in the admin", async () => {
      renderHeader("/admin/case-studies/abc");
      await userEvent.type(screen.getByRole("searchbox", { name: "Search the admin" }), "smiles{Enter}");
      expect(nav.push).toHaveBeenCalledWith("/admin/case-studies?q=smiles");
    });

    it("searches blog posts when you are in the blog section", async () => {
      renderHeader("/admin/posts");
      await userEvent.type(screen.getByRole("searchbox", { name: "Search the admin" }), "ai{Enter}");
      expect(nav.push).toHaveBeenCalledWith("/admin/posts?q=ai");
    });

    it("encodes what you type so it survives the address", async () => {
      renderHeader("/admin/case-studies");
      await userEvent.type(screen.getByRole("searchbox", { name: "Search the admin" }), "a&b c{Enter}");
      expect(nav.push).toHaveBeenCalledWith("/admin/case-studies?q=a%26b%20c");
    });

    it("goes to the plain list when the box is empty", async () => {
      renderHeader("/admin/posts");
      await userEvent.type(screen.getByRole("searchbox", { name: "Search the admin" }), "{Enter}");
      expect(nav.push).toHaveBeenCalledWith("/admin/posts");
    });
  });
});

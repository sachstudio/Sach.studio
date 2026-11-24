import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/case-studies" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { SidebarProvider } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

function renderSidebar(pathname: string) {
  nav.pathname = pathname;
  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
  );
}

describe("AppSidebar", () => {
  it("puts the dashboard first, under its own Dashboard label", () => {
    renderSidebar("/admin");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/admin");
    const links = screen.getAllByRole("link").map((a) => a.textContent);
    expect(links.indexOf("Overview")).toBeLessThan(links.indexOf("Case studies"));
  });

  it("marks Overview as current on the admin home only", () => {
    renderSidebar("/admin");
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Case studies" })).not.toHaveAttribute("aria-current");
  });

  it("does not mark Overview as current inside a section", () => {
    renderSidebar("/admin/posts");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("groups the two admin sections under a Content label", () => {
    renderSidebar("/admin/case-studies");
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("href", "/admin/case-studies");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("href", "/admin/posts");
  });

  it("has a Pricing group with Packages, and a Cal.com group with Booking", () => {
    renderSidebar("/admin");
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Packages" })).toHaveAttribute("href", "/admin/pricing");
    expect(screen.getByText("Cal.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Booking" })).toHaveAttribute("href", "/admin/bookings");
  });

  it("marks Packages and Booking as current inside their own pages", () => {
    renderSidebar("/admin/pricing/abc");
    expect(screen.getByRole("link", { name: "Packages" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Booking" })).not.toHaveAttribute("aria-current");
  });

  it("has a Website sections group with Testimonials and FAQs", () => {
    renderSidebar("/admin");
    expect(screen.getByText("Website sections")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Testimonials" })).toHaveAttribute("href", "/admin/testimonials");
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute("href", "/admin/faqs");
  });

  it("marks FAQs as current inside its own pages and not Testimonials", () => {
    renderSidebar("/admin/faqs/abc");
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Testimonials" })).not.toHaveAttribute("aria-current");
  });

  it("links out to the public site in a new tab", () => {
    renderSidebar("/admin/case-studies");
    const site = screen.getByRole("link", { name: /View website/ });
    expect(site).toHaveAttribute("href", "/");
    expect(site).toHaveAttribute("target", "_blank");
  });

  it("marks the current section, including on its edit pages", () => {
    renderSidebar("/admin/case-studies/abc-123");
    expect(screen.getByRole("link", { name: "Case studies" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Blog posts" })).not.toHaveAttribute("aria-current");
  });

  it("marks Blog posts inside the blog section", () => {
    renderSidebar("/admin/posts/new");
    expect(screen.getByRole("link", { name: "Blog posts" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Case studies" })).not.toHaveAttribute("aria-current");
  });

  it("shows the studio logo as the way home, with an Admin tag", () => {
    renderSidebar("/admin/posts");
    expect(screen.getByRole("link", { name: "Sach Studio admin home" })).toHaveAttribute("href", "/admin/case-studies");
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not repeat the published count or a New case study button, the dashboard and header already show them", () => {
    renderSidebar("/admin/case-studies");
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText(/case studies are live/)).toBeNull();
    expect(screen.queryByRole("link", { name: "New case study" })).toBeNull();
  });
});

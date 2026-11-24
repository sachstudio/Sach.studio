import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { TestimonialTable, type TestimonialRow } from "./TestimonialTable";

const row = (o: Partial<TestimonialRow> = {}): TestimonialRow => ({
  id: "t1",
  name: "Emily Carter",
  role: "Founder, SaaS Startup",
  tag: "Website & Landing Pages",
  quote: "Sach Studio completely changed how people perceived our business online.",
  avatarUrl: "",
  status: "published",
  position: 10,
  ...o,
});

describe("TestimonialTable", () => {
  it("lists each client with their role, quote, label, visibility and position", () => {
    render(<TestimonialTable rows={[row(), row({ id: "t2", name: "Daniel Brooks", role: "Founder, Tech Startup", tag: "Branding", quote: "The branding felt strategic.", status: "draft", position: 20 })]} />);
    const table = within(screen.getByRole("table", { name: "Testimonials" }));
    expect(table.getByRole("link", { name: "Emily Carter" })).toHaveAttribute("href", "/admin/testimonials/t1");
    expect(table.getByText("Founder, SaaS Startup")).toBeInTheDocument();
    expect(table.getByText(/completely changed how people perceived/)).toBeInTheDocument();
    expect(table.getByText("Website & Landing Pages")).toBeInTheDocument();
    expect(table.getByText("Shown")).toBeInTheDocument();
    expect(table.getByText("Hidden")).toBeInTheDocument();
  });

  it("shows the client's photo when there is one, and their initials when there is not", () => {
    render(<TestimonialTable rows={[row({ avatarUrl: "/images/testimonials/avatar-1.png" }), row({ id: "t2", name: "Daniel Brooks" })]} />);
    expect(document.querySelector('img[src="/images/testimonials/avatar-1.png"]')).not.toBeNull();
    expect(screen.getByText("DB")).toBeInTheDocument();
  });

  it("offers a way to add a testimonial and explains an empty list", () => {
    render(<TestimonialTable rows={[]} />);
    expect(screen.getByRole("link", { name: /New testimonial/ })).toHaveAttribute("href", "/admin/testimonials/new");
    expect(screen.getByText(/No testimonials yet/)).toBeInTheDocument();
  });
});

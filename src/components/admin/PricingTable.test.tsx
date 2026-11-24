import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { PricingTable, type PricingRow } from "./PricingTable";

const row = (o: Partial<PricingRow> = {}): PricingRow => ({
  id: "p1",
  name: "Websites & Landing Pages",
  description: "High-performing sites",
  price: "$2,999",
  priceLabel: "Starting from",
  benefits: 7,
  status: "published",
  position: 20,
  ...o,
});

describe("PricingTable", () => {
  it("lists each package with its price, benefit count, visibility and position", () => {
    render(<PricingTable rows={[row(), row({ id: "p2", name: "Logo", price: "$1,999", benefits: 5, status: "draft" })]} />);
    const table = within(screen.getByRole("table", { name: "Packages" }));
    expect(table.getByRole("link", { name: "Websites & Landing Pages" })).toHaveAttribute("href", "/admin/pricing/p1");
    expect(table.getByText("$2,999")).toBeInTheDocument();
    expect(table.getByText("7")).toBeInTheDocument();
    expect(table.getByText("Shown")).toBeInTheDocument();
    expect(table.getByText("Hidden")).toBeInTheDocument();
  });

  it("offers a way to add a package", () => {
    render(<PricingTable rows={[]} />);
    expect(screen.getByRole("link", { name: /New package/ })).toHaveAttribute("href", "/admin/pricing/new");
    expect(screen.getByText(/No packages yet/)).toBeInTheDocument();
  });
});

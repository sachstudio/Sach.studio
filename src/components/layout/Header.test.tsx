import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the four nav links with the design labels in order", () => {
    render(<Header currentPath="/" />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const labels = within(nav)
      .getAllByRole("link")
      .map((a) => a.textContent);
    expect(labels).toEqual(["Home", "About", "Works", "Contact Us"]);
  });

  it("marks only the link for the current path with aria-current", () => {
    render(<Header currentPath="/about" />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("treats a nested works path as the Works link", () => {
    render(<Header currentPath="/works/hasiru-dala-innovations-website-redesign" />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Works" })).toHaveAttribute("aria-current", "page");
  });

  it("toggles a mobile menu from the menu button", async () => {
    render(<Header currentPath="/" />);
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(within(screen.getByRole("navigation", { name: "Mobile" })).getAllByRole("link")).toHaveLength(4);
  });

  it("points the menu button at the menu it opens", async () => {
    render(<Header currentPath="/" />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-controls", menu.id);
  });

  it("closes the mobile menu with Escape and returns focus to the button", async () => {
    render(<Header currentPath="/" />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
  });

  it("keeps every header control at least 44px tall for touch", () => {
    render(<Header currentPath="/" />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveClass("size-11");
    expect(screen.getByRole("link", { name: "Sach Studio home" })).toHaveClass("min-h-11");
  });
});

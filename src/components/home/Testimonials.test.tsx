import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Testimonials } from "./Testimonials";
import { home } from "@/content/home";

describe("Testimonials", () => {
  it("has six testimonials in the content", () => {
    expect(home.testimonials).toHaveLength(6);
  });

  it("shows the first pair and disables the previous button", () => {
    render(<Testimonials />);
    expect(screen.getByText("Emily Carter")).toBeInTheDocument();
    expect(screen.getByText("Daniel Brooks")).toBeInTheDocument();
    expect(screen.queryByText("Sophia Martinez")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeDisabled();
  });

  it("advances to the next pair and enables previous", async () => {
    render(<Testimonials />);
    await userEvent.click(screen.getByRole("button", { name: "Next testimonials" }));
    expect(screen.getByText("Sophia Martinez")).toBeInTheDocument();
    expect(screen.queryByText("Emily Carter")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous testimonials" })).toBeEnabled();
  });

  it("disables next on the last pair", async () => {
    render(<Testimonials />);
    const next = screen.getByRole("button", { name: "Next testimonials" });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText("Arjun Patel")).toBeInTheDocument();
    expect(next).toBeDisabled();
  });
});

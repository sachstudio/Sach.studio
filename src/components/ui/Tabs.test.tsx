import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const items = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
] as const;

describe("Tabs", () => {
  it("calls onChange with the value of the clicked tab", async () => {
    const onChange = vi.fn();
    render(<Tabs items={[...items]} value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("marks only the selected tab as selected", () => {
    render(<Tabs items={[...items]} value="b" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "false");
  });

  it("moves selection to the next tab on ArrowRight and wraps from the last", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Tabs items={[...items]} value="a" onChange={onChange} />);
    screen.getByRole("tab", { name: "Alpha" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("b");
    rerender(<Tabs items={[...items]} value="c" onChange={onChange} />);
    screen.getByRole("tab", { name: "Gamma" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("a");
  });
});

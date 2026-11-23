import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePagination } from "./TablePagination";

function setup(props: Partial<React.ComponentProps<typeof TablePagination>> = {}) {
  const onPageChange = vi.fn();
  const onPageSizeChange = vi.fn();
  render(<TablePagination total={25} page={1} pageSize={10} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} {...props} />);
  return { onPageChange, onPageSizeChange };
}

describe("TablePagination", () => {
  it("reads like the demo: Show [n] per page", () => {
    setup();
    expect(screen.getByText("Show")).toBeInTheDocument();
    expect(screen.getByText("per page")).toBeInTheDocument();
  });

  it("says which rows are showing out of how many", () => {
    setup({ page: 2 });
    expect(screen.getByText("11-20 of 25")).toBeInTheDocument();
  });

  it("clamps the last page's range to the total", () => {
    setup({ page: 3 });
    expect(screen.getByText("21-25 of 25")).toBeInTheDocument();
  });

  it("reads 0 of 0 when there is nothing to page through", () => {
    setup({ total: 0 });
    expect(screen.getByText("0 of 0")).toBeInTheDocument();
  });

  it("shows page numbers and marks the current one", () => {
    setup({ page: 2 });
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
  });

  it("jumps to a page number", async () => {
    const { onPageChange } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it("moves between pages with the arrow buttons", async () => {
    const { onPageChange } = setup({ page: 2 });
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
  });

  it("disables the arrows at the ends instead of hiding them", () => {
    setup({ page: 1 });
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  it("disables Next on the last page", () => {
    setup({ page: 3 });
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("shows a single page number when everything fits", () => {
    setup({ total: 8 });
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Page 2" })).not.toBeInTheDocument();
  });

  it("lets you change how many rows show per page", async () => {
    const { onPageSizeChange } = setup();
    await userEvent.selectOptions(screen.getByLabelText("Rows per page"), "25");
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });
});

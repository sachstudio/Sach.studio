import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const router = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

import { RefreshButton } from "./RefreshButton";

beforeEach(() => router.refresh.mockClear());

describe("RefreshButton", () => {
  it("has an accessible name even though it only shows an icon", () => {
    render(<RefreshButton />);
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("reloads the page's data when clicked", async () => {
    render(<RefreshButton />);
    await userEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
});

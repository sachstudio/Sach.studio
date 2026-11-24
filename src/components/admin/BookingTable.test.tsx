import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { BookingTable, type BookingRow } from "./BookingTable";

const row = (overrides: Partial<BookingRow> = {}): BookingRow => ({
  id: "b1",
  name: "Asha Rao",
  email: "asha@example.com",
  when: "Sat, 28 Nov 2026, 4:00 pm",
  whenAt: "2026-11-28T10:30:00.000Z",
  timezone: "Asia/Dubai",
  status: "confirmed",
  notes: "Need a website for my clinic",
  meetingUrl: "https://app.cal.com/video/abc",
  ...overrides,
});

const ready = { webhookUrl: "https://sach.studio/api/webhooks/cal", secretSet: true };

describe("BookingTable", () => {
  it("lists each request with who, when, status, notes and the meeting link", () => {
    render(<BookingTable rows={[row()]} setup={ready} />);
    const cells = within(screen.getByRole("table", { name: "Bookings" }));
    expect(cells.getByText("Asha Rao")).toBeInTheDocument();
    expect(cells.getByRole("link", { name: "asha@example.com" })).toHaveAttribute("href", "mailto:asha@example.com");
    expect(cells.getByText("Sat, 28 Nov 2026, 4:00 pm")).toBeInTheDocument();
    expect(cells.getByText("Asia/Dubai")).toBeInTheDocument();
    expect(cells.getByText("Confirmed")).toBeInTheDocument();
    expect(cells.getByText("Need a website for my clinic")).toBeInTheDocument();
    expect(cells.getByRole("link", { name: "Join call" })).toHaveAttribute("href", "https://app.cal.com/video/abc");
  });

  it("names each status in plain words", () => {
    render(
      <BookingTable
        rows={[
          row({ id: "1", status: "requested" }),
          row({ id: "2", status: "cancelled" }),
          row({ id: "3", status: "rescheduled" }),
          row({ id: "4", status: "rejected" }),
        ]}
        setup={ready}
      />,
    );
    for (const label of ["Needs approval", "Cancelled", "Rescheduled", "Declined"]) expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("filters by search text", async () => {
    render(<BookingTable rows={[row(), row({ id: "b2", name: "Ravi Kumar", email: "ravi@example.com" })]} setup={ready} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search bookings" }), "ravi");
    expect(screen.queryByText("Asha Rao")).toBeNull();
    expect(screen.getByText("Ravi Kumar")).toBeInTheDocument();
  });

  it("explains how to connect Cal.com until the webhook secret is set", () => {
    render(<BookingTable rows={[]} setup={{ ...ready, secretSet: false }} />);
    expect(screen.getByText("https://sach.studio/api/webhooks/cal")).toBeInTheDocument();
    expect(screen.getByText("CAL_WEBHOOK_SECRET")).toBeInTheDocument();
  });

  it("shows a friendly empty message once connected", () => {
    render(<BookingTable rows={[]} setup={ready} />);
    expect(screen.getByText(/No bookings yet/)).toBeInTheDocument();
    expect(screen.queryByText("CAL_WEBHOOK_SECRET")).toBeNull();
  });
});

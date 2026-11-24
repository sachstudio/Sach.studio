// @vitest-environment node
import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ upsertBooking: vi.fn() }));
vi.mock("@/db", () => ({ getRepo: async () => ({ upsertBooking: mocks.upsertBooking }) }));

import { POST } from "./route";

const SECRET = "test-secret";
const created = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    uid: "uid-1",
    title: "15 Min Meeting",
    startTime: "2026-11-28T10:30:00.000Z",
    endTime: "2026-11-28T10:45:00.000Z",
    attendees: [{ name: "Asha", email: "asha@example.com", timeZone: "Asia/Kolkata" }],
  },
};

function call(body: unknown, signWith: string | null = SECRET) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const headers: Record<string, string> = {};
  if (signWith !== null) headers["x-cal-signature-256"] = createHmac("sha256", signWith).update(raw).digest("hex");
  return POST(new Request("http://localhost/api/webhooks/cal", { method: "POST", body: raw, headers }));
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("CAL_WEBHOOK_SECRET", SECRET);
});

describe("POST /api/webhooks/cal", () => {
  it("stores a correctly signed booking", async () => {
    const response = await call(created);
    expect(response.status).toBe(200);
    expect(mocks.upsertBooking).toHaveBeenCalledTimes(1);
    expect(mocks.upsertBooking.mock.calls[0][0]).toMatchObject({ calUid: "uid-1", attendeeEmail: "asha@example.com", status: "confirmed" });
  });

  it("refuses a missing or wrong signature and stores nothing", async () => {
    expect((await call(created, null)).status).toBe(401);
    expect((await call(created, "wrong")).status).toBe(401);
    expect(mocks.upsertBooking).not.toHaveBeenCalled();
  });

  it("refuses everything when no secret is configured", async () => {
    vi.stubEnv("CAL_WEBHOOK_SECRET", "");
    const response = await call(created);
    expect(response.status).toBe(503);
    expect(mocks.upsertBooking).not.toHaveBeenCalled();
  });

  it("accepts events it does not store, so Cal.com does not keep retrying", async () => {
    const response = await call({ triggerEvent: "MEETING_ENDED", uid: "x" });
    expect(response.status).toBe(200);
    expect(mocks.upsertBooking).not.toHaveBeenCalled();
  });

  it("answers 400 for a body that is not JSON", async () => {
    expect((await call("not json")).status).toBe(400);
  });

  it("answers 500 when saving fails, so Cal.com retries", async () => {
    mocks.upsertBooking.mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await call(created)).status).toBe(500);
  });
});

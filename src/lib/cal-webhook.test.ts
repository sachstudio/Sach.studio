import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseCalEvent, verifyCalSignature } from "./cal-webhook";

const sign = (body: string, secret: string) => createHmac("sha256", secret).update(body).digest("hex");

describe("verifyCalSignature", () => {
  const body = '{"triggerEvent":"BOOKING_CREATED"}';

  it("accepts the HMAC-SHA256 hex digest of the raw body", () => {
    expect(verifyCalSignature(body, sign(body, "s3cret"), "s3cret")).toBe(true);
  });

  it("rejects a wrong secret, a changed body, a missing header and no-secret-provided", () => {
    expect(verifyCalSignature(body, sign(body, "other"), "s3cret")).toBe(false);
    expect(verifyCalSignature(body + " ", sign(body, "s3cret"), "s3cret")).toBe(false);
    expect(verifyCalSignature(body, null, "s3cret")).toBe(false);
    expect(verifyCalSignature(body, "no-secret-provided", "s3cret")).toBe(false);
  });

  it("never accepts anything when no secret is configured", () => {
    expect(verifyCalSignature(body, sign(body, ""), "")).toBe(false);
    expect(verifyCalSignature(body, "no-secret-provided", undefined)).toBe(false);
  });
});

const created = {
  triggerEvent: "BOOKING_CREATED",
  createdAt: "2026-11-24T10:00:00.000Z",
  payload: {
    uid: "uid-1",
    title: "15 Min Meeting between Sach Studio and Asha Rao",
    eventTitle: "15 Min Meeting",
    startTime: "2026-11-28T10:30:00.000Z",
    endTime: "2026-11-28T10:45:00.000Z",
    additionalNotes: "Need a website for my clinic",
    location: "integrations:daily",
    metadata: { videoCallUrl: "https://app.cal.com/video/abc" },
    attendees: [{ name: "Asha Rao", email: "asha@example.com", timeZone: "Asia/Kolkata" }],
    responses: { name: { value: "Asha Rao" }, email: { value: "asha@example.com" }, notes: { value: "Need a website for my clinic" } },
  },
};

describe("parseCalEvent", () => {
  it("reads a new booking", () => {
    const result = parseCalEvent(created);
    expect(result).toEqual({
      booking: {
        calUid: "uid-1",
        title: "15 Min Meeting between Sach Studio and Asha Rao",
        eventTitle: "15 Min Meeting",
        startTime: new Date("2026-11-28T10:30:00.000Z"),
        endTime: new Date("2026-11-28T10:45:00.000Z"),
        status: "confirmed",
        attendeeName: "Asha Rao",
        attendeeEmail: "asha@example.com",
        attendeeTimezone: "Asia/Kolkata",
        notes: "Need a website for my clinic",
        meetingUrl: "https://app.cal.com/video/abc",
      },
      replacesUid: null,
    });
  });

  it("marks a booking that needs approval as requested", () => {
    const result = parseCalEvent({ ...created, triggerEvent: "BOOKING_REQUESTED" });
    expect(result?.booking.status).toBe("requested");
  });

  it("reads cancellations and rejections", () => {
    expect(parseCalEvent({ ...created, triggerEvent: "BOOKING_CANCELLED" })?.booking.status).toBe("cancelled");
    expect(parseCalEvent({ ...created, triggerEvent: "BOOKING_REJECTED" })?.booking.status).toBe("rejected");
  });

  it("reports which earlier booking a reschedule replaces", () => {
    const result = parseCalEvent({
      ...created,
      triggerEvent: "BOOKING_RESCHEDULED",
      payload: { ...created.payload, uid: "uid-2", rescheduleUid: "uid-1" },
    });
    expect(result?.booking.calUid).toBe("uid-2");
    expect(result?.booking.status).toBe("confirmed");
    expect(result?.replacesUid).toBe("uid-1");
  });

  it("falls back to the responses when there is no attendee list, and to a link in location", () => {
    const result = parseCalEvent({
      triggerEvent: "BOOKING_CREATED",
      payload: {
        uid: "uid-3",
        title: "Call",
        startTime: "2026-11-28T10:30:00.000Z",
        endTime: "2026-11-28T10:45:00.000Z",
        location: "https://meet.google.com/xyz",
        responses: { name: { value: "Ravi" }, email: { value: "ravi@example.com" } },
      },
    });
    expect(result?.booking.attendeeName).toBe("Ravi");
    expect(result?.booking.attendeeEmail).toBe("ravi@example.com");
    expect(result?.booking.meetingUrl).toBe("https://meet.google.com/xyz");
    expect(result?.booking.notes).toBe("");
  });

  it("ignores events that are not about a booking, and payloads it cannot use", () => {
    expect(parseCalEvent({ triggerEvent: "MEETING_ENDED", uid: "x" })).toBeNull();
    expect(parseCalEvent({ triggerEvent: "BOOKING_CREATED", payload: { title: "no uid" } })).toBeNull();
    expect(parseCalEvent({ triggerEvent: "BOOKING_CREATED", payload: { uid: "u", startTime: "not a date" } })).toBeNull();
    expect(parseCalEvent(null)).toBeNull();
    expect(parseCalEvent("text")).toBeNull();
  });
});

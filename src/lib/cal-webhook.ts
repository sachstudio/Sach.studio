import { createHmac, timingSafeEqual } from "node:crypto";

export type BookingStatus = "confirmed" | "requested" | "cancelled" | "rejected" | "rescheduled";

export type BookingInput = {
  calUid: string;
  title: string;
  eventTitle: string;
  startTime: Date;
  endTime: Date | null;
  status: BookingStatus;
  attendeeName: string;
  attendeeEmail: string;
  attendeeTimezone: string;
  notes: string;
  meetingUrl: string;
};

export type ParsedCalEvent = { booking: BookingInput; replacesUid: string | null };

/**
 * Cal.com signs each webhook with an HMAC-SHA256 hex digest of the raw request body, sent in the
 * X-Cal-Signature-256 header. Without a configured secret nothing is accepted: an unsigned
 * endpoint would let anyone write to the bookings list.
 */
export function verifyCalSignature(rawBody: string, header: string | null, secret: string | undefined): boolean {
  if (!secret || !header) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const given = Buffer.from(header.trim().toLowerCase());
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

const STATUS_BY_EVENT: Record<string, BookingStatus> = {
  BOOKING_CREATED: "confirmed",
  BOOKING_RESCHEDULED: "confirmed",
  BOOKING_REQUESTED: "requested",
  BOOKING_CANCELLED: "cancelled",
  BOOKING_REJECTED: "rejected",
};

type Obj = Record<string, unknown>;
const isObj = (value: unknown): value is Obj => typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const responseValue = (responses: unknown, key: string): string => (isObj(responses) && isObj(responses[key]) ? text(responses[key].value) : "");

function toDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** The booking inside a Cal.com webhook body, or null for events and payloads this site does not store. */
export function parseCalEvent(body: unknown): ParsedCalEvent | null {
  if (!isObj(body) || typeof body.triggerEvent !== "string") return null;
  const status = STATUS_BY_EVENT[body.triggerEvent];
  if (!status || !isObj(body.payload)) return null;

  const p = body.payload;
  const calUid = text(p.uid);
  const startTime = toDate(p.startTime);
  if (!calUid || !startTime) return null;

  const attendee = Array.isArray(p.attendees) && isObj(p.attendees[0]) ? p.attendees[0] : {};
  const metadata = isObj(p.metadata) ? p.metadata : {};
  const videoCall = isObj(p.videoCallData) ? p.videoCallData : {};
  const location = text(p.location);

  return {
    booking: {
      calUid,
      title: text(p.title),
      eventTitle: text(p.eventTitle) || text(p.type),
      startTime,
      endTime: toDate(p.endTime),
      status,
      attendeeName: text(attendee.name) || responseValue(p.responses, "name"),
      attendeeEmail: text(attendee.email) || responseValue(p.responses, "email"),
      attendeeTimezone: text(attendee.timeZone),
      notes: text(p.additionalNotes) || responseValue(p.responses, "notes"),
      meetingUrl: text(metadata.videoCallUrl) || text(videoCall.url) || (/^https?:\/\//.test(location) ? location : ""),
    },
    replacesUid: body.triggerEvent === "BOOKING_RESCHEDULED" ? text(p.rescheduleUid) || null : null,
  };
}

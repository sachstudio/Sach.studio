import { getRepo } from "@/db";
import { parseCalEvent, verifyCalSignature } from "@/lib/cal-webhook";

/**
 * Receives Cal.com booking webhooks and keeps the admin's Booking list up to date.
 * Cal.com signs every request with CAL_WEBHOOK_SECRET; anything unsigned or wrongly signed is refused.
 */
export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Cal.com webhook is not set up: add CAL_WEBHOOK_SECRET." }, { status: 503 });
  }

  const raw = await request.text();
  if (!verifyCalSignature(raw, request.headers.get("x-cal-signature-256"), secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Body is not JSON" }, { status: 400 });
  }

  const event = parseCalEvent(body);
  if (!event) return Response.json({ ok: true, stored: false });

  try {
    await (await getRepo()).upsertBooking(event.booking, event.replacesUid);
    return Response.json({ ok: true, stored: true });
  } catch (error) {
    console.error("Cal.com webhook could not save the booking", error);
    return Response.json({ error: "Could not save the booking" }, { status: 500 });
  }
}

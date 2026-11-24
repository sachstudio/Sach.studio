import { connection } from "next/server";
import { BookingTable } from "@/components/admin/BookingTable";
import { getRepo } from "@/db";
import { gateAdmin } from "@/lib/admin-gate";
import { formatBookingTime } from "@/lib/admin-list";
import { siteUrl } from "@/lib/site-url";

export default async function AdminBookingsPage() {
  await connection(); // read the database at request time, never during the build
  await gateAdmin();
  const bookings = await (await getRepo()).adminListBookings();

  return (
    <BookingTable
      setup={{ webhookUrl: `${siteUrl()}/api/webhooks/cal`, secretSet: Boolean(process.env.CAL_WEBHOOK_SECRET) }}
      rows={bookings.map((b) => ({
        id: b.id,
        name: b.attendeeName,
        email: b.attendeeEmail,
        when: formatBookingTime(b.startTime),
        whenAt: b.startTime.toISOString(),
        timezone: b.attendeeTimezone,
        status: b.status,
        notes: b.notes,
        meetingUrl: b.meetingUrl,
      }))}
    />
  );
}

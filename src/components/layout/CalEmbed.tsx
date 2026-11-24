export function CalEmbed({ calLink }: { calLink?: string }) {
  const link = (calLink ?? process.env.NEXT_PUBLIC_CAL_LINK ?? "").trim().replace(/^\/+/, "");

  if (!link) {
    return (
      <div className="mx-auto w-full max-w-[1300px] rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-6 text-center text-neutral-600 sm:p-10">
        <p className="font-serif text-2xl text-neutral-900">Booking is not set up yet</p>
        <p className="mt-2">
          Add your Cal.com link as <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_CAL_LINK</code>{" "}
          (for example <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">your-name/15min</code>) to show the calendar here.
        </p>
      </div>
    );
  }

  return (
    // No frame around the calendar: Cal.com draws its own card, at most 1040px wide, so the box is exactly that
    // wide and the widget fills it. On smaller screens it shrinks with the page.
    // Cal.com stacks its details, calendar and time slots into one column while the frame is narrower than 768px
    // (a page narrower than about 816px). That column is about 1100px tall, so the frame is made that tall and the
    // page scrolls instead of a second scroll bar appearing inside the frame. From 816px the three-column layout
    // fits in 680px.
    <div className="mx-auto w-full max-w-[1040px]">
      <iframe
        title="Book a 15-minute call"
        src={`https://cal.com/${link}?embed=true&layout=month_view&theme=light`}
        loading="lazy"
        className="block h-[1100px] w-full border-0 bg-transparent min-[816px]:h-[680px]"
      />
    </div>
  );
}

export function CalEmbed({ calLink }: { calLink?: string }) {
  const link = (calLink ?? process.env.NEXT_PUBLIC_CAL_LINK ?? "").trim().replace(/^\/+/, "");

  if (!link) {
    return (
      <div className="mx-auto max-w-[1300px] rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-neutral-600">
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
    <div className="mx-auto w-full max-w-[1040px]">
      <iframe
        title="Book a 15-minute call"
        src={`https://cal.com/${link}?embed=true&layout=month_view&theme=light`}
        loading="lazy"
        className="h-[760px] w-full border-0 bg-transparent sm:h-[680px]"
      />
    </div>
  );
}

import { home } from "@/content/home";

export function Stats() {
  return (
    <section aria-label="Studio at a glance" className="px-4 py-12 sm:px-6">
      <dl className="mx-auto grid max-w-[1300px] grid-cols-1 divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {home.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse items-center gap-2 px-6 py-8">
            <dt className="text-[17px] text-neutral-500">{s.label}</dt>
            <dd className="font-serif text-[56px] leading-none text-neutral-900">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { home } from "@/content/home";

export function Stats() {
  return (
    <section aria-label="Studio at a glance" className="px-4 py-10 sm:px-6 sm:py-12">
      <dl className="mx-auto grid max-w-[1300px] grid-cols-1 divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {home.stats.map((s) => (
          // Phones read each stat as one line ("8+ Years of Experience"); from sm up the number sits above its label.
          <div
            key={s.label}
            className="flex flex-row-reverse items-baseline justify-center gap-3 px-4 py-5 sm:flex-col-reverse sm:items-center sm:gap-2 sm:px-6 sm:py-8"
          >
            <dt className="text-base text-neutral-500 sm:text-[17px]">{s.label}</dt>
            <dd className="font-serif text-5xl leading-none text-neutral-900 sm:text-[56px]">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

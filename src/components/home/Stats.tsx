import { Reveal } from "@/components/ui/Reveal";
import { home } from "@/content/home";

export function Stats() {
  return (
    <section aria-label="Studio at a glance" className="px-4 py-10 sm:px-6 sm:py-12">
      <Reveal>
        {/* Three across at every width: the number above its label, thin vertical lines between. On phones the
            number is a little smaller and the label wraps inside its column so all three fit one row. */}
        <dl className="mx-auto grid max-w-[1300px] grid-cols-3 divide-x divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white/60">
          {home.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse items-center justify-center gap-1.5 px-2 py-6 text-center sm:gap-2 sm:px-6 sm:py-8"
            >
              <dt className="text-balance text-sm leading-snug text-neutral-500 sm:text-[17px]">{s.label}</dt>
              <dd className="font-serif text-4xl leading-none text-neutral-900 sm:text-[56px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

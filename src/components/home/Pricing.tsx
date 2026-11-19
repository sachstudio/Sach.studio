import { Button, SectionHeading } from "@/components/ui";
import { home } from "@/content/home";

function SparkIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-blue-400">
      <path d="M12 1.5C12 7.5 16.5 12 22.5 12 16.5 12 12 16.5 12 22.5 12 16.5 7.5 12 1.5 12 7.5 12 12 7.5 12 1.5Z" fill="currentColor" />
    </svg>
  );
}

export function Pricing() {
  const { pricing } = home;
  return (
    <section id="pricing" className="scroll-mt-10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <SectionHeading title={pricing.title} subtitle={pricing.subtitle} />
        <div className="grid gap-6 md:grid-cols-2">
          {pricing.plans.map((plan) => (
            <article key={plan.id} className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
              <div className="rounded-2xl bg-neutral-100/70 p-6 sm:p-8">
                <h3 className="font-serif text-[34px] leading-tight text-neutral-950 sm:text-[38px]">{plan.name}</h3>
                <p className="mt-3 min-h-[3.5rem] text-[15px] leading-relaxed text-neutral-600">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-3 font-serif">
                  <span className="text-[28px] text-neutral-500">Starting from</span>
                  <span data-testid="price" className="text-[40px] leading-none text-blue-500">
                    {plan.price}
                  </span>
                </p>
                <Button variant="primary" href="#book-a-call" fullWidth className="mt-6">
                  Book a 15min call
                </Button>
              </div>
              <ul className="flex flex-col gap-3.5 px-6 py-7 sm:px-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] text-neutral-800">
                    <SparkIcon />
                    <span className="border-b border-dotted border-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

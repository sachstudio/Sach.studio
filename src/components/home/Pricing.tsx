import { Button, SectionHeading, SnapRow, SnapSlide } from "@/components/ui";
import { home } from "@/content/home";
import type { PricingPlan } from "@/db/schema";

function SparkIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-blue-400">
      <path d="M12 1.5C12 7.5 16.5 12 22.5 12 16.5 12 12 16.5 12 22.5 12 16.5 7.5 12 1.5 12 7.5 12 12 7.5 12 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** The package cards, filled in from the admin's Pricing > Packages. The heading stays in the site content. */
export function Pricing({ plans }: { plans: Pick<PricingPlan, "id" | "name" | "description" | "priceLabel" | "price" | "ctaLabel" | "ctaHref" | "features">[] }) {
  const { pricing } = home;
  return (
    <section id="pricing" className="scroll-mt-10 px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
        <SectionHeading title={pricing.title} subtitle={pricing.subtitle} />
        {/* Phones: swipe row. md: one card per row (price panel beside the feature list), two columns from lg. */}
        <SnapRow label="Pricing packages, swipe to see more" className="md:grid md:gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <SnapSlide
              as="article"
              key={plan.id}
              className="rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:block"
            >
              <div className="rounded-2xl bg-neutral-100/70 p-5 sm:p-8 md:flex md:flex-col lg:block">
                <h3 className="font-serif text-[30px] leading-tight text-neutral-950 sm:text-[38px]">{plan.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 lg:min-h-[3.5rem]">{plan.description}</p>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 font-serif md:mt-auto md:pt-6 lg:mt-6 lg:pt-0">
                  {plan.priceLabel && <span className="text-2xl text-neutral-500 sm:text-[28px]">{plan.priceLabel}</span>}
                  <span data-testid="price" className="text-[40px] leading-none text-blue-500">
                    {plan.price}
                  </span>
                </p>
                <Button variant="primary" href={plan.ctaHref} fullWidth className="mt-6">
                  {plan.ctaLabel}
                </Button>
              </div>
              <ul className="flex flex-col gap-3.5 px-4 py-6 sm:px-8 sm:py-7 md:justify-center">
                {plan.features.map((feature, i) => (
                  <li key={`${i}-${feature}`} className="flex items-start gap-3 text-[15px] text-neutral-800">
                    <SparkIcon />
                    <span className="border-b border-dotted border-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </SnapSlide>
          ))}
        </SnapRow>
      </div>
    </section>
  );
}

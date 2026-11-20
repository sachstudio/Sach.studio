import { Accordion } from "@/components/ui";
import { Reveal } from "@/components/ui/Reveal";
import type { FaqItem } from "@/content/faqs";

type FaqProps = {
  title: string;
  subtitle: string;
  items: FaqItem[];
  /** "split" is the Home layout (heading left, list right); "stacked" is the Contact layout. */
  layout?: "split" | "stacked";
};

export function Faq({ title, subtitle, items, layout = "split" }: FaqProps) {
  if (layout === "stacked") {
    return (
      <section className="px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto flex max-w-[860px] flex-col gap-12">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="font-serif text-4xl text-neutral-950 sm:text-5xl md:text-[56px]">{title}</h2>
            <p className="text-base text-neutral-600 sm:text-lg">{subtitle}</p>
          </div>
          <Accordion items={items} />
        </div>
      </section>
    );
  }
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_624px] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          <h2 className="font-serif text-4xl leading-[1.1] text-neutral-950 sm:text-5xl md:text-[56px]">{title}</h2>
          <p className="max-w-[620px] text-base leading-[1.75] text-neutral-600 sm:text-lg">{subtitle}</p>
        </Reveal>
        <Accordion items={items} />
      </div>
    </section>
  );
}

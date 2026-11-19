import Image from "next/image";
import { SectionHeading } from "@/components/ui";
import { home } from "@/content/home";

export function Process() {
  const { process } = home;
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <SectionHeading title={process.title} subtitle={process.subtitle} />
        <ol className="grid gap-6 md:grid-cols-3">
          {process.steps.map((step) => (
            <li key={step.label} className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card">
              <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-6">
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-sm font-medium uppercase tracking-[0.2em]">{step.label}</span>
                  <span className="text-sm">{step.duration}</span>
                </div>
                <h3 className="mt-4 font-serif text-4xl leading-tight text-neutral-950">{step.title}</h3>
                <p className="text-[17px] leading-relaxed text-neutral-600">{step.text}</p>
              </div>
              <Image
                src={step.image}
                alt=""
                width={380}
                height={380}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

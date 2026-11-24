import Image from "next/image";
import { SectionHeading } from "@/components/ui";
import { home } from "@/content/home";

export function Process() {
  const { process } = home;
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
        <SectionHeading title={process.title} subtitle={process.subtitle} />
        {/* One step per row below lg (text beside the picture on tablets), three columns from lg. */}
        <ol className="grid gap-6 lg:grid-cols-3">
          {process.steps.map((step) => (
            <li
              key={step.label}
              className="flex flex-col rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card md:flex-row lg:flex-col"
            >
              <div className="flex flex-1 flex-col gap-4 px-4 pb-5 pt-5 sm:px-5 sm:pb-6 sm:pt-6 md:justify-center md:px-8 lg:justify-start lg:px-5">
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-sm font-medium uppercase tracking-[0.2em]">{step.label}</span>
                  <span className="text-sm">{step.duration}</span>
                </div>
                <h3 className="mt-2 font-serif text-4xl leading-tight text-neutral-950 sm:mt-4">{step.title}</h3>
                <p className="text-[17px] leading-relaxed text-neutral-600">{step.text}</p>
              </div>
              <Image
                src={step.image}
                alt=""
                width={380}
                height={380}
                className="aspect-[4/3] w-full rounded-2xl object-cover md:aspect-auto md:w-[44%] md:shrink-0 lg:aspect-square lg:w-full"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

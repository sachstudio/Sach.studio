import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/content/about";

export function FounderMessage() {
  const { founder } = about;
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1300px] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-card sm:rounded-3xl sm:p-2.5 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-5 px-4 py-6 sm:px-10 sm:py-12">
          <h2 className="font-serif text-4xl leading-[1.1] text-neutral-950 sm:text-5xl">{founder.title}</h2>
          <div className="flex max-w-[34rem] flex-col gap-4 text-base leading-[1.75] text-neutral-600">
            {founder.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-base font-medium text-neutral-900">{founder.name}</p>
            <p className="text-sm text-neutral-500">{founder.role}</p>
          </div>
        </Reveal>
        <Image
          src={founder.photo}
          alt={founder.photoAlt}
          width={630}
          height={768}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[4/5] w-full rounded-xl object-cover object-[50%_20%] sm:rounded-2xl md:aspect-[6/5] lg:aspect-auto lg:h-full lg:min-h-[420px]"
        />
      </div>
    </section>
  );
}

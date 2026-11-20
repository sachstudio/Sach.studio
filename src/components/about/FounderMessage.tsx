import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/content/about";

export function FounderMessage() {
  const { founder } = about;
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-[1300px] overflow-hidden rounded-3xl border border-neutral-200 bg-white p-2.5 shadow-card lg:grid-cols-2">
        <Reveal className="flex flex-col gap-5 px-6 py-8 sm:px-10 sm:py-12">
          <h2 className="font-serif text-4xl text-neutral-950 sm:text-5xl">{founder.title}</h2>
          <div className="flex flex-col gap-4 text-[15px] leading-[1.8] text-neutral-600">
            {founder.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-neutral-900">{founder.name}</p>
            <p className="text-xs text-neutral-500">{founder.role}</p>
          </div>
        </Reveal>
        <Image
          src={founder.photo}
          alt={founder.photoAlt}
          width={630}
          height={768}
          className="h-full min-h-[420px] w-full rounded-2xl object-cover"
        />
      </div>
    </section>
  );
}

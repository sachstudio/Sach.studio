import Image from "next/image";
import { SectionHeading, SnapRow, SnapSlide } from "@/components/ui";
import { about } from "@/content/about";

export function Values() {
  const { values } = about;
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
        <SectionHeading title={values.title} subtitle={values.subtitle} />
        <SnapRow as="ul" label="What drives Sach Studio, swipe to see more values" className="md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {values.items.map((item) => (
            <SnapSlide
              as="li"
              key={item.title}
              className="flex flex-col items-center gap-5 rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-card sm:gap-6 sm:p-8"
            >
              <h3 className="font-serif text-2xl text-neutral-900">{item.title}</h3>
              <Image
                src={item.icon}
                alt=""
                width={140}
                height={130}
                className="h-24 w-auto rounded-2xl sm:h-28"
              />
              <p className="text-base leading-[1.65] text-neutral-600">{item.text}</p>
            </SnapSlide>
          ))}
        </SnapRow>
      </div>
    </section>
  );
}

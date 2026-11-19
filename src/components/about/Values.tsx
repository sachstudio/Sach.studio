import Image from "next/image";
import { SectionHeading } from "@/components/ui";
import { about } from "@/content/about";

export function Values() {
  const { values } = about;
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <SectionHeading title={values.title} subtitle={values.subtitle} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col items-center gap-6 rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-card"
            >
              <h3 className="font-serif text-2xl text-neutral-900">{item.title}</h3>
              <Image
                src={item.icon}
                alt=""
                width={140}
                height={130}
                className="h-28 w-auto mix-blend-multiply"
              />
              <p className="text-[15px] leading-relaxed text-neutral-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

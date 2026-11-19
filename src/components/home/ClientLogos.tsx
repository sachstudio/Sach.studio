import Image from "next/image";
import { home } from "@/content/home";

export function ClientLogos() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-12">
        <h2 className="max-w-[860px] text-center text-lg font-medium text-neutral-900 sm:text-xl">{home.trustedBy}</h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {home.clientLogos.map((logo) => (
            <li key={logo.name}>
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                className="h-16 w-auto mix-blend-multiply sm:h-[70px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

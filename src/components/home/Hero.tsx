import Image from "next/image";
import { Button, Pill } from "@/components/ui";
import { home } from "@/content/home";

export function Hero() {
  const { hero } = home;
  return (
    <section className="px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-[1300px] flex-col items-center text-center">
        <Pill tone="green" className="motion-enter">
          {hero.badge}
        </Pill>
        <h1 style={{ "--motion-delay": "100ms" } as React.CSSProperties} className="motion-enter mt-10 font-serif font-normal leading-[1.02] tracking-[-0.02em] text-neutral-950 text-balance">
          <span className="block text-[44px] sm:text-7xl md:text-[80px]">{hero.title}</span>
          <span className="mt-1 block text-[44px] text-blue-500 sm:text-7xl md:text-[80px]">{hero.accent}</span>
        </h1>
        <p
          style={{ "--motion-delay": "200ms" } as React.CSSProperties}
          className="motion-enter mt-8 max-w-[920px] text-lg leading-[1.7] text-neutral-600 text-pretty sm:text-xl"
        >
          {hero.subtitle}
        </p>
        <div style={{ "--motion-delay": "300ms" } as React.CSSProperties} className="motion-enter mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button variant="primary" href="#book-a-call">
            Book a 15min call
          </Button>
          <Button variant="outline" href="/works">
            View our work
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-[1300px] rounded-[28px] border border-neutral-200 bg-white p-2.5 shadow-card">
        <Image
          src="/images/hero/hero-photo.webp"
          alt="A presenter on camera in a studio, the kind of brand video and web experience Sach Studio builds for clients"
          width={1280}
          height={720}
          priority
          className="aspect-video w-full rounded-[20px] object-cover"
        />
      </div>
    </section>
  );
}

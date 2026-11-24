import Image from "next/image";
import { Button, Pill } from "@/components/ui";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText, wordCount } from "@/components/ui/SplitText";
import { home } from "@/content/home";

export function Hero() {
  const { hero } = home;
  return (
    <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-24">
      <div className="mx-auto flex max-w-[1300px] flex-col items-center text-center">
        <Pill tone="green" className="motion-enter">
          {hero.badge}
        </Pill>
        <h1
          style={{ "--motion-delay": "100ms" } as React.CSSProperties}
          className="mt-8 font-serif font-normal leading-[1.02] tracking-[-0.02em] text-neutral-950 text-balance sm:mt-10"
        >
          <span className="block text-[44px] sm:text-7xl md:text-[80px]">
            <SplitText text={hero.title} />
          </span>
          <span className="mt-1 block text-[44px] text-blue-500 sm:text-7xl md:text-[80px]">
            <SplitText text={hero.accent} startIndex={wordCount(hero.title)} />
          </span>
        </h1>
        <p
          style={{ "--motion-delay": "500ms" } as React.CSSProperties}
          className="motion-enter mt-6 max-w-[920px] text-lg leading-[1.7] text-neutral-600 text-pretty sm:mt-8 sm:text-xl"
        >
          {hero.subtitle}
        </p>
        <div
          style={{ "--motion-delay": "650ms" } as React.CSSProperties}
          className="motion-enter mt-8 flex w-full max-w-[420px] flex-col gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
        >
          <Button variant="primary" href="#book-a-call">
            Book a 15min call
          </Button>
          <Button variant="outline" href="/works">
            View our work
          </Button>
        </div>
      </div>

      <Reveal className="mx-auto mt-12 max-w-[1300px] rounded-3xl border border-neutral-200 bg-white p-2 shadow-card sm:mt-20 sm:rounded-[28px] sm:p-2.5">
        <Image
          src="/images/hero/hero-photo.webp"
          alt="A presenter on camera in a studio, the kind of brand video and web experience Sach Studio builds for clients"
          width={1280}
          height={720}
          priority
          sizes="(min-width: 1344px) 1280px, calc(100vw - 32px)"
          className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-video sm:rounded-[20px]"
        />
      </Reveal>
    </section>
  );
}

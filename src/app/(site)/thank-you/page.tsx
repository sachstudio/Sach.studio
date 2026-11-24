import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "Thank you",
  description: "We have received your enquiry and will respond within 24 to 48 business hours.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  const { thanks } = about;
  return (
    <section className="px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-28">
      <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
        <span className="rounded-md border border-[#bfe6d0] bg-[#d9f2e4] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-[#15803d]">
          {thanks.badge}
        </span>
        <Image
          src="/images/thanks/hands.png"
          alt=""
          width={150}
          height={150}
          className="mt-8 size-24 rounded-3xl sm:size-28"
        />
        <h1 className="mt-6 font-serif text-[52px] leading-none text-neutral-950 min-[400px]:text-6xl sm:mt-4 sm:text-7xl">
          {thanks.title}
        </h1>
        <h2 className="mt-10 font-serif text-[28px] leading-[1.2] text-neutral-900 text-balance min-[400px]:text-3xl sm:mt-12 sm:text-4xl">
          {thanks.subtitle}
        </h2>
        <p className="mt-5 max-w-[640px] text-base leading-[1.75] text-neutral-600 text-pretty sm:text-lg">{thanks.text}</p>
        <Button variant="primary" href="/about" className="mt-10">
          Know more about us
        </Button>
      </div>
    </section>
  );
}

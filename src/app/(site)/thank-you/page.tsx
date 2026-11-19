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
    <section className="px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
      <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
        <span className="rounded-md border border-[#bfe6d0] bg-[#d9f2e4] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.06em] text-[#15803d]">
          {thanks.badge}
        </span>
        <Image
          src="/images/thanks/hands.png"
          alt=""
          width={150}
          height={150}
          className="mt-8 size-24 mix-blend-multiply"
        />
        <h1 className="mt-2 font-serif text-6xl leading-none text-neutral-950 sm:text-7xl">{thanks.title}</h1>
        <h2 className="mt-12 font-serif text-3xl text-neutral-900 sm:text-4xl">{thanks.subtitle}</h2>
        <p className="mt-5 max-w-[640px] text-lg leading-[1.75] text-neutral-600">{thanks.text}</p>
        <Button variant="primary" href="/about" className="mt-10">
          Know more about us
        </Button>
      </div>
    </section>
  );
}

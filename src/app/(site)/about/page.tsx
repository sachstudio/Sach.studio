import type { Metadata } from "next";
import { FounderMessage } from "@/components/about/FounderMessage";
import { Values } from "@/components/about/Values";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Stats } from "@/components/home/Stats";
import { BookingSection } from "@/components/layout/BookingSection";
import { SectionHeading } from "@/components/ui";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About Sach Studio",
  description:
    "Sach Studio is a premium design and development studio helping startups and modern businesses build high-performing websites, apps and brands focused on growth and conversions.",
};

export default function AboutPage() {
  return (
    <>
      <section className="px-4 pb-6 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-[1300px]">
          <SectionHeading
            as="h1"
            size="hero"
            title={about.hero.title}
            accent={about.hero.accent}
            subtitle={about.hero.subtitle}
            className="mx-auto max-w-[920px]"
          />
        </div>
      </section>
      <Stats />
      <ClientLogos />
      <FounderMessage />
      <Values />
      <BookingSection />
    </>
  );
}

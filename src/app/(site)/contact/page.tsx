import type { Metadata } from "next";
import { Faq } from "@/components/home/Faq";
import { CalEmbed } from "@/components/layout/CalEmbed";
import { SectionHeading } from "@/components/ui";
import { about } from "@/content/about";
import { getPublishedFaqs } from "@/db/queries";

export const metadata: Metadata = {
  title: "Contact Us: Book a 15-minute call",
  description:
    "Choose a time that works for you and discuss your project, goals and how Sach Studio can help bring your vision to life.",
};

export default async function ContactPage() {
  const { contact } = about;
  const faqs = await getPublishedFaqs("contact");
  return (
    <>
      <section className="px-4 pb-10 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
          <SectionHeading
            as="h1"
            size="hero"
            title={contact.title}
            accent={contact.accent}
            subtitle={contact.subtitle}
            className="mx-auto max-w-[860px]"
          />
          <div id="book-a-call" className="scroll-mt-10">
            <CalEmbed />
          </div>
        </div>
      </section>
      <Faq title={contact.faqTitle} subtitle={contact.faqSubtitle} items={faqs} layout="stacked" />
    </>
  );
}

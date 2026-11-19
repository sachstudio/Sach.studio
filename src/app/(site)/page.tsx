import type { Metadata } from "next";
import { BookingSection } from "@/components/layout/BookingSection";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Pricing } from "@/components/home/Pricing";
import { Process } from "@/components/home/Process";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyUs } from "@/components/home/WhyUs";
import { FeaturedWork } from "@/components/works/FeaturedWork";
import { homeFaqs } from "@/content/faqs";
import { home } from "@/content/home";

export const metadata: Metadata = {
  title: { absolute: "Sach Studio: Website, App & Dashboard Design and Development" },
  description:
    "Sach Studio helps startups, businesses and modern brands launch high-converting websites, mobile apps, web apps and dashboards that look premium, perform fast and scale.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ClientLogos />
      <FeaturedWork />
      <Process />
      <Pricing />
      <WhyUs />
      <Testimonials />
      <Faq title={home.faq.title} subtitle={home.faq.subtitle} items={homeFaqs} />
      <BookingSection />
    </>
  );
}

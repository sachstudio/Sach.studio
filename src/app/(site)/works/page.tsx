import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingSection } from "@/components/layout/BookingSection";
import { SectionHeading } from "@/components/ui";
import { WorksExplorer } from "@/components/works/WorksExplorer";
import { getPublishedCaseStudies } from "@/db/queries";
import { toCardData } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Our Works: Websites, Apps, Dashboards and Branding",
  description:
    "A showcase of premium digital experiences crafted for startups, founders and modern businesses across different industries.",
};

export default async function WorksPage() {
  const studies = await getPublishedCaseStudies();
  const projects = studies.map(toCardData);

  return (
    <>
      <section className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
          <SectionHeading
            as="h1"
            size="hero"
            title="Explore"
            accent="Our Works"
            subtitle="A showcase of premium digital experiences crafted for startups, founders, and modern businesses across different industries."
          />
          <Suspense fallback={<div className="h-[600px]" aria-busy />}>
            <WorksExplorer projects={projects} />
          </Suspense>
        </div>
      </section>
      <BookingSection />
    </>
  );
}

import { Button, SectionHeading } from "@/components/ui";
import { getPublishedCaseStudies } from "@/db/queries";
import { home } from "@/content/home";
import { sortFeaturedFirst, toCardData } from "@/lib/projects";
import { ProjectGrid } from "./ProjectGrid";

/** The "Proven Results in Action" block on Home: category tabs over the published projects. */
export async function FeaturedWork() {
  const studies = await getPublishedCaseStudies();
  return (
    <section id="projects" className="scroll-mt-10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-14">
        <SectionHeading title={home.work.title} subtitle={home.work.subtitle} />
        <ProjectGrid projects={sortFeaturedFirst(studies).map(toCardData)} variant="featured" showLoadMore={false} pageSize={4} />
        <Button variant="primary" href="/works">
          View our work
        </Button>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/works/CaseStudyView";
import { getPublishedCaseStudies, getPublishedCaseStudy, getRelatedCaseStudies } from "@/db/queries";

type Params = { params: Promise<{ slug: string }> };

// Cache Components needs at least one real param to prerender; slugs published later render on request.
export async function generateStaticParams() {
  const studies = await getPublishedCaseStudies();
  const slugs = studies.filter((s) => s.about.trim()).map((s) => ({ slug: s.slug }));
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = await getPublishedCaseStudy((await params).slug);
  if (!study) return {};
  const description = study.metaDescription || study.summary || study.subtitle;
  // The owner-written meta title is already complete (it names the studio), so skip the site-wide title template.
  const title = study.metaTitle ? { absolute: study.metaTitle } : study.title;
  return {
    title,
    description,
    openGraph: {
      title: study.metaTitle || study.title,
      description,
      images: study.heroImageUrl ? [study.heroImageUrl] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = await getPublishedCaseStudy(slug);
  // Drafts, unpublished studies and concept cards without a case study all 404.
  if (!study || !study.about.trim()) notFound();
  const related = await getRelatedCaseStudies(slug, 3);
  return <CaseStudyView study={study} related={related} />;
}

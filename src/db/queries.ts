import { cacheLife, cacheTag } from "next/cache";
import type { CategorySlug } from "@/lib/categories";
import type { FaqPage } from "@/lib/faq-pages";
import { caseStudiesTag, caseStudyTag, faqsTag, postTag, postsTag, pricingTag, testimonialsTag } from "@/lib/tags";
import { getRepo } from "./index";

/*
 * Public readers. Each is cached and tagged, so public pages are served as static content and
 * only refresh when the admin publishes, edits or deletes something (see src/lib/tags.ts).
 * Only published rows are ever returned; drafts never leave the admin.
 */

export async function getPublishedCaseStudies(opts: { category?: CategorySlug; featuredOnly?: boolean } = {}) {
  "use cache";
  cacheTag(caseStudiesTag);
  cacheLife("hours");
  return (await getRepo()).listPublishedCaseStudies(opts);
}

export async function getPublishedCaseStudy(slug: string) {
  "use cache";
  cacheTag(caseStudiesTag, caseStudyTag(slug));
  cacheLife("hours");
  return (await getRepo()).getPublishedCaseStudy(slug);
}

export async function getRelatedCaseStudies(slug: string, limit = 3) {
  "use cache";
  cacheTag(caseStudiesTag);
  cacheLife("hours");
  return (await getRepo()).listRelatedCaseStudies(slug, limit);
}

export async function getPublishedPosts() {
  "use cache";
  cacheTag(postsTag);
  cacheLife("hours");
  return (await getRepo()).listPublishedPosts();
}

export async function getPublishedPost(slug: string) {
  "use cache";
  cacheTag(postsTag, postTag(slug));
  cacheLife("hours");
  return (await getRepo()).getPublishedPost(slug);
}

export async function getRelatedPosts(slug: string, limit = 2) {
  "use cache";
  cacheTag(postsTag);
  cacheLife("hours");
  return (await getRepo()).listRelatedPosts(slug, limit);
}

/** The FAQs one page of the website shows: only the ones switched on for it, in the admin's order. */
export async function getPublishedFaqs(page: FaqPage) {
  "use cache";
  cacheTag(faqsTag);
  cacheLife("hours");
  return (await getRepo()).listPublishedFaqs(page);
}

/** The client quotes in the home page's testimonials section, in the admin's order. */
export async function getPublishedTestimonials() {
  "use cache";
  cacheTag(testimonialsTag);
  cacheLife("hours");
  return (await getRepo()).listPublishedTestimonials();
}

/** The package cards in the home page's pricing section: only the ones switched on, in the admin's order. */
export async function getPublishedPricingPlans() {
  "use cache";
  cacheTag(pricingTag);
  cacheLife("hours");
  return (await getRepo()).listPublishedPricingPlans();
}

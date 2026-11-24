export const caseStudiesTag = "case-studies";
export const postsTag = "posts";
export const pricingTag = "pricing";
export const faqsTag = "faqs";
export const testimonialsTag = "testimonials";

export const caseStudyTag = (slug: string) => `case-study:${slug}`;
export const postTag = (slug: string) => `post:${slug}`;

/** Tags to refresh when a case study is saved, published, unpublished or deleted. */
export function tagsForCaseStudyChange(slug: string, previousSlug?: string): string[] {
  const tags = [caseStudiesTag, caseStudyTag(slug)];
  if (previousSlug && previousSlug !== slug) tags.push(caseStudyTag(previousSlug));
  return tags;
}

export function tagsForPostChange(slug: string, previousSlug?: string): string[] {
  const tags = [postsTag, postTag(slug)];
  if (previousSlug && previousSlug !== slug) tags.push(postTag(previousSlug));
  return tags;
}

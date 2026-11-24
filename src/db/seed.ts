import { eq } from "drizzle-orm";
import { createRepo, type Db } from "./repo";
import { seedCaseStudies, seedFaqs, seedPosts, seedPricingPlans, seedTestimonials } from "./seed-data";
import { blogPosts, caseStudies, faqs, pricingPlans, testimonials } from "./schema";

/**
 * Add the studio's starting content, matched by slug.
 *
 * By default it only inserts what is missing, so running it again never overwrites edits made in the
 * admin, never republishes something that was unpublished, and returns how many items it added.
 * With `force: true` it also resets existing items back to the starting content.
 */
export async function seedDatabase(
  db: Db,
  options: { force?: boolean } = {},
): Promise<{ caseStudies: number; posts: number; pricingPlans: number; faqs: number; testimonials: number }> {
  const repo = createRepo(db);
  let addedStudies = 0;
  let addedPosts = 0;

  for (const input of seedCaseStudies) {
    const [existing] = await db.select({ id: caseStudies.id }).from(caseStudies).where(eq(caseStudies.slug, input.slug)).limit(1);
    if (existing && !options.force) continue;
    const result = await repo.saveCaseStudy(input, existing?.id);
    if (!result.ok) throw new Error(`Seeding case study "${input.slug}" failed: ${result.error}`);
    addedStudies += 1;
  }
  for (const input of seedPosts) {
    const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, input.slug)).limit(1);
    if (existing && !options.force) continue;
    const result = await repo.savePost(input, existing?.id);
    if (!result.ok) throw new Error(`Seeding post "${input.slug}" failed: ${result.error}`);
    addedPosts += 1;
  }

  // Packages have no slug to match on, so they are only added to an empty table: a package the owner
  // deleted or reworded in the admin never comes back.
  let addedPlans = 0;
  const [anyPlan] = await db.select({ id: pricingPlans.id }).from(pricingPlans).limit(1);
  if (!anyPlan || options.force) {
    if (options.force) await db.delete(pricingPlans);
    for (const input of seedPricingPlans) {
      const result = await repo.savePricingPlan(input);
      if (!result.ok) throw new Error(`Seeding package "${input.name}" failed: ${result.error}`);
      addedPlans += 1;
    }
  }

  // FAQs and testimonials work the same way: only added to an empty table, so deleting or rewording one sticks.
  let addedFaqs = 0;
  const [anyFaq] = await db.select({ id: faqs.id }).from(faqs).limit(1);
  if (!anyFaq || options.force) {
    if (options.force) await db.delete(faqs);
    for (const input of seedFaqs) {
      const result = await repo.saveFaq(input);
      if (!result.ok) throw new Error(`Seeding FAQ "${input.question}" failed: ${result.error}`);
      addedFaqs += 1;
    }
  }
  let addedTestimonials = 0;
  const [anyTestimonial] = await db.select({ id: testimonials.id }).from(testimonials).limit(1);
  if (!anyTestimonial || options.force) {
    if (options.force) await db.delete(testimonials);
    for (const input of seedTestimonials) {
      const result = await repo.saveTestimonial(input);
      if (!result.ok) throw new Error(`Seeding testimonial "${input.name}" failed: ${result.error}`);
      addedTestimonials += 1;
    }
  }
  return { caseStudies: addedStudies, posts: addedPosts, pricingPlans: addedPlans, faqs: addedFaqs, testimonials: addedTestimonials };
}

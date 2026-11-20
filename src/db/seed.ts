import { eq } from "drizzle-orm";
import { createRepo, type Db } from "./repo";
import { seedCaseStudies, seedPosts } from "./seed-data";
import { blogPosts, caseStudies } from "./schema";

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
): Promise<{ caseStudies: number; posts: number }> {
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
  return { caseStudies: addedStudies, posts: addedPosts };
}

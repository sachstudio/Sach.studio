import { eq } from "drizzle-orm";
import { createRepo, type Db } from "./repo";
import { seedCaseStudies, seedPosts } from "./seed-data";
import { blogPosts, caseStudies } from "./schema";

/** Insert or update the studio's starting content, matched by slug, so running it twice changes nothing. */
export async function seedDatabase(db: Db): Promise<{ caseStudies: number; posts: number }> {
  const repo = createRepo(db);

  for (const input of seedCaseStudies) {
    const [existing] = await db.select({ id: caseStudies.id }).from(caseStudies).where(eq(caseStudies.slug, input.slug)).limit(1);
    const result = await repo.saveCaseStudy(input, existing?.id);
    if (!result.ok) throw new Error(`Seeding case study "${input.slug}" failed: ${result.error}`);
  }
  for (const input of seedPosts) {
    const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, input.slug)).limit(1);
    const result = await repo.savePost(input, existing?.id);
    if (!result.ok) throw new Error(`Seeding post "${input.slug}" failed: ${result.error}`);
  }
  return { caseStudies: seedCaseStudies.length, posts: seedPosts.length };
}

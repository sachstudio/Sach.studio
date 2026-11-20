import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "../src/db/repo";
import { seedDatabase } from "../src/db/seed";
import * as schema from "../src/db/schema";

/**
 * Seed the Neon database named by DATABASE_URL: `npm run db:seed`.
 * Only adds what is missing, so it is safe to run again and never overwrites admin edits.
 * `npm run db:seed -- --force` also resets existing starting items to the original content.
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first, then `npm run db:seed`.");
    process.exit(1);
  }
  const force = process.argv.includes("--force");
  const db = drizzle(neon(url), { schema }) as unknown as Db;
  const counts = await seedDatabase(db, { force });
  console.log(
    `${force ? "Reset or added" : "Added"} ${counts.caseStudies} case studies and ${counts.posts} posts` +
      (force ? "." : " (existing items left unchanged)."),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

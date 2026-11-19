import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "../src/db/repo";
import { seedDatabase } from "../src/db/seed";
import * as schema from "../src/db/schema";

/** Seed the Neon database named by DATABASE_URL: `npm run db:seed`. Safe to run more than once. */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first, then `npm run db:seed`.");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema }) as unknown as Db;
  const counts = await seedDatabase(db);
  console.log(`Seeded ${counts.caseStudies} case studies and ${counts.posts} posts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

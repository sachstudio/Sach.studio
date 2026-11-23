import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db } from "../src/db/repo";
import * as schema from "../src/db/schema";
import { validateCaseStudy } from "../src/lib/validation";

/**
 * Adds or updates case studies from JSON files: `npm run db:import -- scripts/case-studies/<file>.json ...`
 * A file whose slug already exists updates that case study (matching by slug); otherwise it is created.
 * Content is checked with the same rules as the admin form, and the file's own "status" is kept
 * ("draft" files never appear on the public site). Needs DATABASE_URL, like `npm run db:seed`.
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
    process.exit(1);
  }
  const files = process.argv.slice(2).filter((a) => a.endsWith(".json"));
  if (!files.length) {
    console.error("Usage: npm run db:import -- scripts/case-studies/<file>.json [...]");
    process.exit(1);
  }
  const repo = createRepo(drizzle(neon(url), { schema }) as unknown as Db);
  const existing = await repo.adminListCaseStudies();
  let failed = false;

  for (const file of files) {
    const checked = validateCaseStudy(JSON.parse(readFileSync(file, "utf8")));
    if (!checked.ok) {
      failed = true;
      console.error(`${file}: not saved.`, checked.errors);
      continue;
    }
    const match = existing.find((c) => c.slug === checked.data.slug);
    const result = await repo.saveCaseStudy(checked.data, match?.id);
    if (!result.ok) {
      failed = true;
      console.error(`${file}: not saved. ${result.error}`);
      continue;
    }
    console.log(`${match ? "Updated" : "Created"} "${checked.data.title}" as ${checked.data.status} (id ${result.id}).`);
  }
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db } from "../src/db/repo";
import * as schema from "../src/db/schema";
import { validateCaseStudy } from "../src/lib/validation";

/**
 * Changes only some fields of existing case studies: `npm run db:patch -- patches/<file>.json`
 * The file is a list like [{ "slug": "my-case-study", "fields": { "heroImageUrl": "/images/x.webp" } }].
 * Everything not listed stays as it is, and the result is checked with the admin form's rules.
 */
async function main() {
  const url = process.env.DATABASE_URL;
  const file = process.argv.find((a) => a.endsWith(".json"));
  if (!url || !file) {
    console.error("Usage: npm run db:patch -- <file>.json (DATABASE_URL must be set)");
    process.exit(1);
  }
  const patches = JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, "")) as { slug: string; fields: Record<string, unknown> }[];
  const repo = createRepo(drizzle(neon(url), { schema }) as unknown as Db);
  const rows = await repo.adminListCaseStudies();
  let failed = false;

  for (const { slug, fields } of patches) {
    const row = rows.find((r) => r.slug === slug);
    if (!row) {
      failed = true;
      console.error(`No case study with slug "${slug}".`);
      continue;
    }
    const checked = validateCaseStudy({ ...row, ...fields });
    if (!checked.ok) {
      failed = true;
      console.error(`${slug}: not saved.`, checked.errors);
      continue;
    }
    const result = await repo.saveCaseStudy(checked.data, row.id);
    if (!result.ok) {
      failed = true;
      console.error(`${slug}: not saved. ${result.error}`);
      continue;
    }
    console.log(`Updated ${slug}: ${Object.keys(fields).join(", ")}`);
  }
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

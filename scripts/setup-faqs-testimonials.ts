import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db } from "../src/db/repo";
import * as schema from "../src/db/schema";
import { seedFaqs, seedTestimonials } from "../src/db/seed-data";

/**
 * One-off, safe to run again: creates the faqs and testimonials tables if they are missing, and puts the
 * FAQs and client quotes the website showed before into them only while each table is empty.
 * Usage: dotenv -e .env.production.local -- tsx scripts/setup-faqs-testimonials.ts
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.production.local --environment production` first.");
    process.exit(1);
  }
  const sql = neon(url);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      question text NOT NULL,
      answer text NOT NULL,
      pages jsonb NOT NULL DEFAULT '["home"]'::jsonb,
      sort_order integer NOT NULL DEFAULT 100,
      status text NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      role text NOT NULL DEFAULT '',
      tag text NOT NULL DEFAULT '',
      quote text NOT NULL,
      avatar_url text NOT NULL DEFAULT '',
      sort_order integer NOT NULL DEFAULT 100,
      status text NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  console.log("Tables are ready: faqs, testimonials.");

  const repo = createRepo(drizzle(sql, { schema }) as unknown as Db);

  const existingFaqs = await repo.adminListFaqs();
  if (existingFaqs.length > 0) {
    console.log(`faqs already has ${existingFaqs.length} row(s); nothing added.`);
  } else {
    for (const faq of seedFaqs) {
      const result = await repo.saveFaq(faq);
      if (!result.ok) throw new Error(`Could not add FAQ "${faq.question}": ${result.error}`);
    }
    console.log(`Added ${seedFaqs.length} FAQs.`);
  }

  const existingTestimonials = await repo.adminListTestimonials();
  if (existingTestimonials.length > 0) {
    console.log(`testimonials already has ${existingTestimonials.length} row(s); nothing added.`);
  } else {
    for (const item of seedTestimonials) {
      const result = await repo.saveTestimonial(item);
      if (!result.ok) throw new Error(`Could not add testimonial "${item.name}": ${result.error}`);
    }
    console.log(`Added ${seedTestimonials.length} testimonials.`);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db } from "../src/db/repo";
import * as schema from "../src/db/schema";
import { seedPricingPlans } from "../src/db/seed-data";

/**
 * One-off, safe to run again: creates the bookings and pricing_plans tables if they are missing, and
 * puts the four original package cards in pricing_plans only while that table is empty.
 * Usage: dotenv -e .env.production.local -- tsx scripts/setup-booking-pricing.ts
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Run `vercel env pull .env.production.local --environment production` first.");
    process.exit(1);
  }
  const sql = neon(url);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      cal_uid text NOT NULL UNIQUE,
      title text NOT NULL DEFAULT '',
      event_title text NOT NULL DEFAULT '',
      start_time timestamptz NOT NULL,
      end_time timestamptz,
      status text NOT NULL DEFAULT 'confirmed',
      attendee_name text NOT NULL DEFAULT '',
      attendee_email text NOT NULL DEFAULT '',
      attendee_timezone text NOT NULL DEFAULT '',
      notes text NOT NULL DEFAULT '',
      meeting_url text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text NOT NULL DEFAULT '',
      price_label text NOT NULL DEFAULT 'Starting from',
      price text NOT NULL,
      cta_label text NOT NULL DEFAULT 'Book a 15min call',
      cta_href text NOT NULL DEFAULT '#book-a-call',
      features jsonb NOT NULL DEFAULT '[]'::jsonb,
      sort_order integer NOT NULL DEFAULT 100,
      status text NOT NULL DEFAULT 'published',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  console.log("Tables are ready: bookings, pricing_plans.");

  const repo = createRepo(drizzle(sql, { schema }) as unknown as Db);
  const existing = await repo.adminListPricingPlans();
  if (existing.length > 0) {
    console.log(`pricing_plans already has ${existing.length} package(s); nothing added.`);
    return;
  }
  for (const plan of seedPricingPlans) {
    const result = await repo.savePricingPlan(plan);
    if (!result.ok) throw new Error(`Could not add "${plan.name}": ${result.error}`);
  }
  console.log(`Added ${seedPricingPlans.length} packages.`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);

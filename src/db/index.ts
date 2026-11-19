import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db, type Repo } from "./repo";
import * as schema from "./schema";

/**
 * Where data lives:
 * - `DATABASE_URL` set: Neon Postgres (production, and any environment pulled with `vercel env pull`).
 * - not set, and not production (or `ALLOW_LOCAL_DB=1`): an in-process Postgres (PGlite) that is
 *   seeded with the studio's content, so the site and the admin work before Neon is connected.
 *   It lives in memory and resets when the server restarts.
 * - not set in production: a clear error, never a silent empty site.
 */
const globalForDb = globalThis as unknown as { __sachRepo?: Promise<Repo> };

async function connect(): Promise<Repo> {
  const url = process.env.DATABASE_URL;
  if (url) {
    return createRepo(drizzle(neon(url), { schema }) as unknown as Db);
  }
  if (process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_DB === "1") {
    const { createLocalDb } = await import("./local");
    return createRepo(await createLocalDb());
  }
  throw new Error(
    "DATABASE_URL is not set. Connect the Neon integration in Vercel and run `vercel env pull .env.local`.",
  );
}

/** The data repository for the current environment (lazy, so importing this file never connects). */
export function getRepo(): Promise<Repo> {
  globalForDb.__sachRepo ??= connect();
  return globalForDb.__sachRepo;
}

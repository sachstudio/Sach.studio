import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createRepo, type Db, type Repo } from "./repo";
import * as schema from "./schema";
import { schemaFingerprint } from "./schema-fingerprint";

/**
 * Where data lives:
 * - `DATABASE_URL` set: Neon Postgres (production, and any environment pulled with `vercel env pull`).
 * - not set, and not production (or `ALLOW_LOCAL_DB=1`): an in-process Postgres (PGlite) that is
 *   seeded with the studio's content, so the site and the admin work before Neon is connected.
 *   It lives in memory and resets when the server restarts.
 * - not set in production: a clear error, never a silent empty site.
 *
 * Only the connection is remembered between requests, together with a fingerprint of the table
 * layout. The repository (a set of small functions) is built fresh on every call, so a new repository
 * method is available straight after you save the file, and a changed table layout starts a new local
 * database instead of reusing one from before the change. Neither needs a dev-server restart.
 */
const globalForDb = globalThis as unknown as { __sachDb?: { fingerprint: string; db: Promise<Db> } };

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    return drizzle(neon(url), { schema }) as unknown as Db;
  }
  if (process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_DB === "1") {
    const { createLocalDb } = await import("./local");
    return createLocalDb();
  }
  throw new Error(
    "DATABASE_URL is not set. Connect the Neon integration in Vercel and run `vercel env pull .env.local`.",
  );
}

/** The data repository for the current environment (lazy, so importing this file never connects). */
export async function getRepo(): Promise<Repo> {
  const fingerprint = schemaFingerprint();
  if (globalForDb.__sachDb?.fingerprint !== fingerprint) {
    globalForDb.__sachDb = { fingerprint, db: connect() };
  }
  return createRepo(await globalForDb.__sachDb.db);
}

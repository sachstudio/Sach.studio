import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import * as schema from "./schema";

/** A fresh in-process Postgres with the real schema applied. Test-only. */
export async function createTestDb() {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  // pushSchema diffs the Drizzle schema against the empty database and applies it.
  const { apply } = await pushSchema(schema, db as never);
  await apply();
  return db;
}

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api";
import type { Db } from "./repo";
import { seedDatabase } from "./seed";
import * as schema from "./schema";

/** In-memory Postgres for local work and builds without Neon. Schema applied, content seeded. */
export async function createLocalDb(): Promise<Db> {
  const db = drizzle(new PGlite(), { schema });
  const { apply } = await pushSchema(schema, db as never);
  await apply();
  await seedDatabase(db as unknown as Db);
  return db as unknown as Db;
}

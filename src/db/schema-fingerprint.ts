import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * A short text that changes whenever a table or one of its columns is added, removed or retyped.
 * The development database remembers it, and starts over when it differs, so a stale in-memory
 * database from before a schema change can never be reused.
 */
export function schemaFingerprint(tables: Record<string, unknown> = schema): string {
  return Object.values(tables)
    .filter((value): value is PgTable => is(value, PgTable))
    .map((table) => {
      const config = getTableConfig(table);
      return `${config.name}(${config.columns.map((c) => `${c.name}:${c.dataType}`).join(",")})`;
    })
    .sort()
    .join(";");
}

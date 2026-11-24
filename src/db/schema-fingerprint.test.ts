import { describe, expect, it } from "vitest";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { schemaFingerprint } from "./schema-fingerprint";

const base = { items: pgTable("items", { id: text("id"), name: text("name") }) };

describe("schemaFingerprint", () => {
  it("is the same for the same tables, however they are ordered", () => {
    const other = { notes: pgTable("notes", { id: text("id") }) };
    expect(schemaFingerprint({ ...base, ...other })).toBe(schemaFingerprint({ ...other, ...base }));
  });

  it("changes when a table is added", () => {
    expect(schemaFingerprint({ ...base, notes: pgTable("notes", { id: text("id") }) })).not.toBe(schemaFingerprint(base));
  });

  it("changes when a column is added or its type changes", () => {
    const withColumn = { items: pgTable("items", { id: text("id"), name: text("name"), rank: integer("rank") }) };
    const retyped = { items: pgTable("items", { id: text("id"), name: integer("name") }) };
    expect(schemaFingerprint(withColumn)).not.toBe(schemaFingerprint(base));
    expect(schemaFingerprint(retyped)).not.toBe(schemaFingerprint(base));
  });

  it("ignores things that are not tables", () => {
    expect(schemaFingerprint({ ...base, helper: () => 1, label: "x" })).toBe(schemaFingerprint(base));
  });

  it("covers the real schema, new tables included", () => {
    const real = schemaFingerprint();
    expect(real).toContain("faqs(");
    expect(real).toContain("testimonials(");
  });
});

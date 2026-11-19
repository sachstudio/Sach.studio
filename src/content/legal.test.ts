import { describe, expect, it } from "vitest";
import { legalDocs, type LegalDoc } from "./legal";

function flatten(doc: LegalDoc): string {
  return JSON.stringify(doc);
}

describe("legalDocs", () => {
  it("has exactly the three policy documents", () => {
    expect(Object.keys(legalDocs).sort()).toEqual(["payment-cancellation", "privacy-policy", "terms-conditions"]);
  });

  it("gives every section a non-empty heading and some content", () => {
    for (const [slug, doc] of Object.entries(legalDocs)) {
      expect(doc.sections.length, slug).toBeGreaterThan(5);
      for (const section of doc.sections) {
        expect(section.heading.trim(), slug).not.toBe("");
        expect(section.blocks.length, `${slug}: ${section.heading}`).toBeGreaterThan(0);
      }
    }
  });

  it("does not carry the misspelled contact email from the old site", () => {
    for (const doc of Object.values(legalDocs)) {
      expect(flatten(doc)).not.toContain("stuido");
    }
  });

  it("ends every document with the contact email and a last-updated date", () => {
    for (const [slug, doc] of Object.entries(legalDocs)) {
      const last = doc.sections[doc.sections.length - 1];
      expect(JSON.stringify(last), slug).toContain("hi@sach.studio");
      expect(doc.updated).toBe("May 2026");
    }
  });

  it("keeps the payment structure the owner wrote: 50% upfront and 50% before handover", () => {
    const text = flatten(legalDocs["payment-cancellation"]);
    expect(text).toContain("50% upfront payment before project initiation");
    expect(text).toContain("50% final payment before project handover or launch");
  });
});

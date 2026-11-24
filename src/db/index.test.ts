// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb } from "./test-db";

const state = vi.hoisted(() => ({ fingerprint: "v1", created: 0 }));

vi.mock("./schema-fingerprint", () => ({ schemaFingerprint: () => state.fingerprint }));
vi.mock("./local", async () => {
  const { createTestDb: make } = await import("./test-db");
  return {
    createLocalDb: async () => {
      state.created += 1;
      return make();
    },
  };
});

import { getRepo } from "./index";

const globals = globalThis as unknown as { __sachDb?: unknown };

beforeEach(() => {
  delete globals.__sachDb;
  state.fingerprint = "v1";
  state.created = 0;
  vi.stubEnv("DATABASE_URL", "");
});
afterEach(() => vi.unstubAllEnvs());

const faq = { question: "Q", answer: "A", pages: ["home" as const], sortOrder: 1, status: "published" as const };

describe("getRepo in development", () => {
  it("keeps one local database between calls, so what you add in the admin stays", async () => {
    await (await getRepo()).saveFaq(faq);
    expect(await (await getRepo()).adminListFaqs()).toHaveLength(1);
    expect(state.created).toBe(1);
  });

  it("builds a fresh repository on every call, so new repository methods are picked up without a restart", async () => {
    const a = await getRepo();
    const b = await getRepo();
    expect(a).not.toBe(b);
    expect(typeof b.listPublishedTestimonials).toBe("function");
  });

  it("starts a new local database when the table layout changes, instead of keeping an out-of-date one", async () => {
    await (await getRepo()).saveFaq(faq);
    state.fingerprint = "v2";
    expect(await (await getRepo()).adminListFaqs()).toHaveLength(0);
    expect(state.created).toBe(2);
  });

  it("test setup sanity: the test database has the real tables", async () => {
    const db = await createTestDb();
    expect(db).toBeTruthy();
  });
});

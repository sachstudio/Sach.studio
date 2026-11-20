// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT:${to}`);
  }),
  forbidden: vi.fn(() => {
    throw new Error("FORBIDDEN");
  }),
}));
vi.mock("./admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect, forbidden: mocks.forbidden }));

import { gateAdmin } from "./admin-gate";

beforeEach(() => vi.clearAllMocks());

describe("gateAdmin", () => {
  it("returns the admin when allowed", async () => {
    mocks.requireAdmin.mockResolvedValue({ userId: "u", email: "owner@sach.studio" });
    await expect(gateAdmin()).resolves.toEqual({ userId: "u", email: "owner@sach.studio" });
  });

  it("sends a signed-out visitor to the sign-in page", async () => {
    mocks.requireAdmin.mockRejectedValue(Object.assign(new Error("x"), { name: "AdminAuthError", kind: "unauthenticated" }));
    await expect(gateAdmin()).rejects.toThrow("REDIRECT:/admin/sign-in");
  });

  it("returns a 403 for a signed-in user who is not on the allowlist", async () => {
    mocks.requireAdmin.mockRejectedValue(Object.assign(new Error("x"), { name: "AdminAuthError", kind: "forbidden" }));
    await expect(gateAdmin()).rejects.toThrow("FORBIDDEN");
  });

  it("does not swallow unexpected errors", async () => {
    mocks.requireAdmin.mockRejectedValue(new Error("clerk exploded"));
    await expect(gateAdmin()).rejects.toThrow("clerk exploded");
  });
});

/*
 * Next.js does not re-run a shared layout when a visitor navigates inside it, so a check that lives
 * only in a layout can be skipped. Every protected page must therefore gate itself.
 */
function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? pageFiles(full) : name === "page.tsx" ? [full] : [];
  });
}

describe("protected admin pages", () => {
  const root = path.join("src", "app", "admin", "(protected)");
  const pages = pageFiles(root);

  it("finds the admin pages", () => {
    // dashboard, case study new / edit / preview, post new / edit
    expect(pages.length).toBeGreaterThanOrEqual(6);
  });

  for (const file of pages) {
    it(`${path.relative(root, file)} calls gateAdmin() itself before reading anything`, () => {
      const source = readFileSync(file, "utf8");
      expect(source).toMatch(/await gateAdmin\(\)/);
      const gate = source.indexOf("await gateAdmin()");
      for (const read of ["getRepo(", "adminGet", "adminList"]) {
        const at = source.indexOf(read);
        if (at !== -1) expect(gate, `${read} comes before the gate`).toBeLessThan(at);
      }
    });
  }

  it("edit forms are not re-created when the saved date changes, which would discard unsaved typing", () => {
    for (const file of pages.filter((f) => f.includes("[id]"))) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/key=\{[^}]*updatedAt/);
    }
  });
});

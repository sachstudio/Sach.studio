// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const clerk = vi.hoisted(() => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => clerk);

import { AdminAuthError, isAdminEmail, requireAdmin } from "./admin-auth";

describe("isAdminEmail", () => {
  it("matches case-insensitively against a comma-separated allowlist with spaces", () => {
    expect(isAdminEmail("Owner@Sach.studio", "owner@sach.studio, other@x.com")).toBe(true);
    expect(isAdminEmail("other@x.com", "owner@sach.studio, other@x.com")).toBe(true);
  });

  it("rejects an email that is not listed", () => {
    expect(isAdminEmail("intruder@x.com", "owner@sach.studio")).toBe(false);
  });

  it("treats an empty or missing allowlist as nobody allowed", () => {
    expect(isAdminEmail("a@b.com", "")).toBe(false);
    expect(isAdminEmail("a@b.com", undefined)).toBe(false);
    expect(isAdminEmail("a@b.com", " , ,")).toBe(false);
  });

  it("rejects a missing email", () => {
    expect(isAdminEmail(null, "a@b.com")).toBe(false);
    expect(isAdminEmail(undefined, "a@b.com")).toBe(false);
    expect(isAdminEmail("", "a@b.com")).toBe(false);
  });
});

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_EMAILS", "owner@sach.studio");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("throws an 'unauthenticated' error when nobody is signed in", async () => {
    clerk.auth.mockResolvedValue({ userId: null });
    await expect(requireAdmin()).rejects.toMatchObject({ name: "AdminAuthError", kind: "unauthenticated" });
  });

  it("throws a 'forbidden' error for a signed-in user who is not on the allowlist", async () => {
    clerk.auth.mockResolvedValue({ userId: "user_1" });
    clerk.currentUser.mockResolvedValue({ primaryEmailAddress: { emailAddress: "intruder@x.com" } });
    const error = await requireAdmin().catch((e) => e);
    expect(error).toBeInstanceOf(AdminAuthError);
    expect(error.kind).toBe("forbidden");
  });

  it("returns the user id and email for an allowlisted admin", async () => {
    clerk.auth.mockResolvedValue({ userId: "user_2" });
    clerk.currentUser.mockResolvedValue({ primaryEmailAddress: { emailAddress: "Owner@sach.studio" } });
    await expect(requireAdmin()).resolves.toEqual({ userId: "user_2", email: "Owner@sach.studio" });
  });

  it("refuses everyone when ADMIN_EMAILS is not set", async () => {
    vi.stubEnv("ADMIN_EMAILS", "");
    clerk.auth.mockResolvedValue({ userId: "user_3" });
    clerk.currentUser.mockResolvedValue({ primaryEmailAddress: { emailAddress: "owner@sach.studio" } });
    await expect(requireAdmin()).rejects.toMatchObject({ kind: "forbidden" });
  });
});

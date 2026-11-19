// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  handleUpload: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => {
  class AdminAuthError extends Error {
    kind: "unauthenticated" | "forbidden";
    constructor(kind: "unauthenticated" | "forbidden") {
      super(kind === "unauthenticated" ? "Sign in to continue" : "Not authorised");
      this.name = "AdminAuthError";
      this.kind = kind;
    }
  }
  return { AdminAuthError, requireAdmin: mocks.requireAdmin };
});
vi.mock("@vercel/blob/client", () => ({ handleUpload: mocks.handleUpload }));

import { AdminAuthError } from "@/lib/admin-auth";
import { POST } from "./route";

function request(body: unknown = { type: "blob.generate-client-token", payload: {} }) {
  return new Request("http://localhost/api/upload", { method: "POST", body: JSON.stringify(body) });
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("POST /api/upload", () => {
  it("returns 403 JSON and never reaches Blob for a signed-in user who is not an admin", async () => {
    mocks.requireAdmin.mockRejectedValue(new AdminAuthError("forbidden"));
    const response = await POST(request());
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "Not authorised" });
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("returns 401 JSON when nobody is signed in", async () => {
    mocks.requireAdmin.mockRejectedValue(new AdminAuthError("unauthenticated"));
    const response = await POST(request());
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Sign in to continue" });
    expect(mocks.handleUpload).not.toHaveBeenCalled();
  });

  it("limits what Blob will accept to the allowed image types and 8 MB", async () => {
    mocks.requireAdmin.mockResolvedValue({ userId: "u", email: "owner@sach.studio" });
    mocks.handleUpload.mockImplementation(async (opts: { onBeforeGenerateToken: (p: string) => Promise<unknown> }) =>
      opts.onBeforeGenerateToken("case-studies/cover.png"),
    );
    const response = await POST(request());
    expect(response.status).toBe(200);
    const token = (await response.json()) as { allowedContentTypes: string[]; maximumSizeInBytes: number };
    expect(token.allowedContentTypes).toEqual(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/avif"]);
    expect(token.maximumSizeInBytes).toBe(8 * 1024 * 1024);
  });

  it("reports a Blob failure as a 400 with a readable message", async () => {
    mocks.requireAdmin.mockResolvedValue({ userId: "u", email: "owner@sach.studio" });
    mocks.handleUpload.mockRejectedValue(new Error("boom"));
    const response = await POST(request());
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/upload/i);
  });
});

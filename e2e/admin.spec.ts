import { expect, test } from "@playwright/test";

/*
 * Signed-out visitors must never see admin content, whatever the Clerk setup. With Clerk keys they are
 * sent to the sign-in page; with none, the admin fails closed with an error.
 */
test.describe("the admin is closed to signed-out visitors", () => {
  for (const path of ["/admin", "/admin/case-studies/new", "/admin/posts/new"]) {
    test(`${path} shows no admin screen`, async ({ page }) => {
      const response = await page.goto(path);
      const status = response?.status() ?? 0;
      const url = page.url();
      const signedOutOutcome = status >= 400 || url.includes("sign-in") || url.includes("accounts.");
      expect(signedOutOutcome, `status ${status} at ${url}`).toBe(true);
      await expect(page.getByRole("button", { name: "Publish" })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Case studies" })).toHaveCount(0);
    });
  }

  test("the upload endpoint refuses a signed-out request", async ({ request }) => {
    const response = await request.post("/api/upload", { data: { type: "blob.generate-client-token", payload: {} } });
    expect(response.ok()).toBe(false);
  });
});

/*
 * The full publish flow needs a Clerk dev instance, a Blob store and a Neon database.
 * Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD (an allowlisted Clerk user) to enable it.
 */
test.describe("publishing from the admin", () => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "needs a signed-in admin (see comment above)");

  test("create, publish, see it live, unpublish, and delete a case study", async ({ page }) => {
    await page.goto("/admin/sign-in");
    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL!);
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByRole("heading", { name: "Case studies" })).toBeVisible();

    const slug = `e2e-${Date.now()}`;
    await page.getByRole("link", { name: "New case study" }).click();
    await page.getByLabel("Title").fill("E2E Case Study");
    await page.getByLabel("URL slug").fill(slug);
    await page.getByLabel("Card image").fill("/images/projects/hasiru-dala-card.webp");
    await page.getByLabel("Card summary").fill("Created by the end-to-end test.");
    await page.getByLabel("About the client or project").fill("About text from the test.");
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByRole("status")).toHaveText("Published");

    await page.goto(`/works/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("E2E Case Study");

    await page.goBack();
    await page.getByRole("button", { name: "Unpublish" }).click();
    await expect(page.getByRole("status")).toHaveText("Unpublished");
    expect((await page.request.get(`/works/${slug}`)).status()).toBe(404);

    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete case study" }).click();
    await expect(page.getByRole("heading", { name: "Case studies" })).toBeVisible();
  });
});

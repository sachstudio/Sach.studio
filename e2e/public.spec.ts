import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/works",
  "/contact",
  "/thank-you",
  "/blogs",
  "/conditions/privacy-policy",
  "/conditions/terms-conditions",
  "/conditions/payment-cancellation",
  "/works/hasiru-dala-innovations-website-redesign",
  "/works/gulf-cv-writers-website-design",
  "/works/cosmion-community-clubhouse-website-design",
  "/works/master-systems-maritime-automation-website",
  "/blogs/why-design-matters",
  "/blogs/use-of-ai",
  "/blogs/importance-of-marketing",
  "/blogs/use-of-social-media",
];

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

function collectProblems(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`console error: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === new URL(page.url() || r.url()).origin) {
      problems.push(`${r.status()} ${r.url()}`);
    }
  });
  return problems;
}

for (const viewport of viewports) {
  test.describe(`every public page at ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      test(route, async ({ page }) => {
        const problems = collectProblems(page);
        const response = await page.goto(route, { waitUntil: "networkidle" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, "horizontal scroll").toBeLessThanOrEqual(0);

        const brokenImages = await page.evaluate(() =>
          [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc),
        );
        expect(brokenImages, "images that failed to load").toEqual([]);
        expect(problems).toEqual([]);
      });
    }
  });
}

/*
 * With Cache Components, a page that is not prerendered is rendered after the shell has been sent, so
 * Next.js answers HTTP 200 and streams the 404 page with a noindex tag (documented behaviour). What must
 * hold: visitors see the "not found" page, search engines are told not to index it, and none of the
 * real content leaks.
 */
test.describe("unknown and unpublished pages", () => {
  for (const path of ["/works/does-not-exist", "/works/arizona-business-loan-page-design", "/blogs/nope", "/conditions/nope"]) {
    test(`${path} shows the not-found page and is marked noindex`, async ({ request }) => {
      const body = await (await request.get(path)).text();
      expect(body).toContain("This page could not be found");
      expect(body).toMatch(/<meta name="robots" content="noindex"/);
      expect(body).not.toContain("Case study");
    });
  }
});

test.describe("old Framer addresses", () => {
  const cases: [string, string][] = [
    ["/about-us", "/about"],
    ["/project", "/works"],
    ["/contact-us", "/contact"],
    ["/projects/hasiru-dala-innovations", "/works/hasiru-dala-innovations-website-redesign"],
    ["/projects/arizona-business-loan-page-design-visualisation", "/works"],
    ["/blogs/why-design-matters-copy", "/blogs/use-of-ai"],
  ];
  for (const [from, to] of cases) {
    test(`${from} moves permanently to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(new URL(response.headers()["location"], "http://x").pathname).toBe(to);
    });
  }
});

test.describe("search files", () => {
  test("sitemap lists published pages and not the thank-you page or the admin", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    expect(body).toContain("/works/hasiru-dala-innovations-website-redesign");
    expect(body).toContain("/blogs/why-design-matters");
    expect(body).not.toContain("/thank-you");
    expect(body).not.toContain("/admin");
    expect(body).not.toContain("arizona-business-loan-page-design");
  });

  test("robots keeps the admin and upload route out of search", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Sitemap:");
  });

  test("the thank-you page asks not to be indexed", async ({ page }) => {
    await page.goto("/thank-you");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("each case study page uses its own meta title without repeating the site name", async ({ page }) => {
    await page.goto("/works/hasiru-dala-innovations-website-redesign");
    await expect(page).toHaveTitle("Hasiru Dala Innovations Website Redesign | Sach Studio");
  });
});

test.describe("interactions", () => {
  test("the Home FAQ opens one answer at a time", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("button", { name: "How Long Does A Project Take?" });
    const second = page.getByRole("button", { name: "Do You Provide Both Design And Development Services?" });
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("Works filters by category, keeps the choice in the address, and loads more", async ({ page }) => {
    await page.goto("/works");
    await expect(page.getByRole("article")).toHaveCount(4);
    await page.getByRole("button", { name: "Load more" }).click();
    await expect(page.getByRole("article")).toHaveCount(5);
    await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);

    await page.getByRole("tab", { name: "Web Apps & Dashboard" }).click();
    await expect(page.getByRole("article")).toHaveCount(2);
    await expect(page).toHaveURL(/category=web-apps-dashboard/);

    await page.getByRole("tab", { name: "Logo & Branding" }).click();
    await expect(page.getByText("No projects in this category yet")).toBeVisible();
  });

  test("opening /works?category=... starts on that category", async ({ page }) => {
    await page.goto("/works?category=web-apps-dashboard");
    await expect(page.getByRole("tab", { name: "Web Apps & Dashboard" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("article")).toHaveCount(2);
  });

  test("Home shows the lead project and links to its case study", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Case study" }).first().click();
    await expect(page).toHaveURL(/\/works\/hasiru-dala-innovations-website-redesign/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hasiru Dala Innovations");
  });

  test("the blog list reveals more posts only when there are more than four", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page.getByRole("article")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);
  });

  test("the mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
});

test.describe("accessibility basics", () => {
  test("keyboard focus is visible on the first link", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline.tag).toBe("A");
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThan(0);
  });

  test("the scrolling marquee stops when the visitor prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/contact");
    const name = await page.evaluate(() => {
      const el = document.querySelector("[class*='animate-']") as HTMLElement;
      return getComputedStyle(el).animationName;
    });
    expect(name).toBe("none");
  });

  test("every image has an alt attribute", async ({ page }) => {
    for (const route of ["/", "/works", "/works/hasiru-dala-innovations-website-redesign", "/about"]) {
      await page.goto(route);
      const missing = await page.evaluate(() => [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.src));
      expect(missing, route).toEqual([]);
    }
  });
});

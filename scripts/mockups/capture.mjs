// Captures 2x screenshots of a live site for the case study mockups.
// Usage: node scripts/mockups/capture.mjs <url> <out-dir>
// Needs an installed browser: set PW_CHANNEL=msedge (or chrome), or run `npx playwright install chromium`.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [url, outDir] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("Usage: node scripts/mockups/capture.mjs <url> <out-dir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });

/** Scroll the whole page once so lazy images and scroll-reveal animations have loaded, then return to the top. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.7));
    // Capped: some pages grow as you scroll (infinite lists, scroll-driven sections).
    for (let n = 0, y = 0; n < 40 && y < document.documentElement.scrollHeight; n++, y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  }).catch(() => {});
  await page.waitForTimeout(1200);
}

/** Close welcome popups, newsletter modals and cookie banners so they do not cover the mockup. */
async function dismissOverlays(page) {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);
    const closers = page.locator(
      [
        '[aria-label*="close" i]',
        'button[class*="close" i]',
        '[data-dismiss]',
        'button:has-text("×")',
        'button:has-text("✕")',
        'button:has-text("No thanks")',
        'button:has-text("Reject")',
      ].join(","),
    );
    const count = await closers.count();
    for (let n = 0; n < count; n++) {
      const el = closers.nth(n);
      if (await el.isVisible().catch(() => false)) {
        await el.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(400);
      }
    }
  }
  // Last resort: hide any fixed full-screen overlay that is still covering the page.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (s.position === "fixed" && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9 && Number(s.zIndex) > 10) {
        el.style.display = "none";
      }
    }
    if (document.documentElement) document.documentElement.style.overflow = "auto";
    if (document.body) document.body.style.overflow = "auto";
  }).catch(() => {});
}

const views = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

for (const v of views) {
  const context = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 2,
    isMobile: v.name !== "desktop",
    hasTouch: v.name !== "desktop",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await dismissOverlays(page);
  await settle(page);
  await dismissOverlays(page);
  await page.screenshot({ path: join(outDir, `${v.name}-top.png`) });
  // Viewport-sized shots down the page (s00, s01, ...): what a visitor sees at each scroll position.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(Math.ceil(total / v.height), 16);
  for (let n = 0; n < steps; n++) {
    await page.evaluate((y) => window.scrollTo(0, y), n * v.height);
    await page.waitForTimeout(700);
    await dismissOverlays(page);
    await page.screenshot({ path: join(outDir, `${v.name}-s${String(n).padStart(2, "0")}.png`) });
  }
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${v.name}: page height ${height}px`);
  await context.close();
}
await browser.close();

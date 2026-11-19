import { defineConfig } from "@playwright/test";

const external = process.env.E2E_BASE_URL;
const port = 3100;

/*
 * Runs against a production build (`npm run build` first). Without E2E_BASE_URL it starts the app
 * itself on its own port with the built-in local database, so no accounts are needed.
 * PW_CHANNEL picks an installed browser ("msedge" or "chrome"); leave it unset to use
 * Playwright's own Chromium after `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: external ?? `http://localhost:${port}`,
    channel: process.env.PW_CHANNEL || undefined,
  },
  webServer: external
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: false,
        timeout: 60_000,
        env: { ALLOW_LOCAL_DB: "1" },
      },
});

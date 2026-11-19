import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Lets the admin layout return a real 403 page with forbidden().
  experimental: { authInterrupts: true },
  // Local in-process Postgres used when no DATABASE_URL is set outside production.
  serverExternalPackages: ["@electric-sql/pglite", "drizzle-kit"],
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

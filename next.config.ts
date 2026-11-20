import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Lets the admin layout return a real 403 page with forbidden().
  experimental: { authInterrupts: true },
  // Images uploaded in the admin live in Vercel Blob; this is the only outside host the site loads images from.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Local in-process Postgres used when no DATABASE_URL is set outside production.
  serverExternalPackages: ["@electric-sql/pglite", "drizzle-kit"],
  partialPrefetching: true,
  async redirects() {
    return legacyRedirects;
  },
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

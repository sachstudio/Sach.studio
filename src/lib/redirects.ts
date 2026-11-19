/**
 * Old Framer addresses and where they live now. Order matters: the specific rules come before the
 * `:slug` catch-alls. Used by next.config.ts, so it must not import from "@/".
 */
export const legacyRedirects = [
  { source: "/about-us", destination: "/about", permanent: true },
  { source: "/project", destination: "/works", permanent: true },
  { source: "/contact-us", destination: "/contact", permanent: true },

  { source: "/projects/hasiru-dala-innovations", destination: "/works/hasiru-dala-innovations-website-redesign", permanent: true },
  { source: "/projects/gulf-cv-writers-landing-more-interviews", destination: "/works/gulf-cv-writers-website-design", permanent: true },
  {
    source: "/projects/master-systems-visualizing-marine-automated-solutions",
    destination: "/works/master-systems-maritime-automation-website",
    permanent: true,
  },
  // The Arizona concept has no case study page, and any other old project falls back to the list.
  { source: "/projects/:slug", destination: "/works", permanent: true },

  // The old CMS gave the blog posts "-copy" addresses; they now have clean ones.
  { source: "/blogs/why-design-matters-copy", destination: "/blogs/use-of-ai", permanent: true },
  { source: "/blogs/why-design-matters-copy-copy", destination: "/blogs/importance-of-marketing", permanent: true },
  { source: "/blogs/why-design-matters-copy-copy-copy", destination: "/blogs/use-of-social-media", permanent: true },
];

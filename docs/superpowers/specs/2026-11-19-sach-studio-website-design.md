# Sach Studio website: design

Date: 2026-11-19. Status: revised after the owner supplied the Figma design file, colour palette, fonts and logo; awaiting approval.

## Revision: the Figma file is the source of truth

The owner supplied the real design: Figma file `Wa3XfhzicxVGMS9NdhdqWD`, page "website Concept Designed by US" (13 frames, 1920px wide, content column 1300px), plus the colour palette, fonts (Instrument Serif and Outfit) and the logo (`public/brand/sach-studio-logo.svg`, renamed from `Logo 2.1.svg`). Where this section conflicts with anything below, **this section wins**. The Framer site is now only a source of copy that the Figma frames do not show in readable form.

What the Figma file changes:

1. **Pages.** The routes below replace the old list.

| Route | Figma frame | Notes |
|---|---|---|
| `/` | Sach/Home | Hero ("We Build High-Performing" with blue second line "Mobile App, Web App & Dashboards"), hero photo card, stats, client logos, filtered project grid (1 featured plus 3), 3-step process with illustrations, pricing (4 plans), "Why you will love us" bento, testimonials slider, FAQ, Cal.com booking, "Let's work together" marquee, footer |
| `/about` | Sach/About US | Hero, stats, logos, founder message with photo, 4 values with icons, booking, footer |
| `/works` | Sach/Projects | Category tabs, project cards with status label, Load more |
| `/works?category=web-apps-dashboard` etc. | Sach/Web Apps & Dashboard | The same page with another tab selected, showing image-only cards. Not a separate route. |
| `/works/[slug]` | HDI, Gulf CV Writers, Cosmion, Master System | One case-study template (4 designed examples) |
| `/blogs` | Blogs | 2-column grid of 4 cards, Load more |
| `/blogs/[slug]` | Blog Details | Title, posted-on date, cover, body |
| `/contact` | Sach/Contact Us | Cal.com booking embed plus 5 FAQs |
| `/thank-you` | Thank you Page | "Message received", "Thank You!", link to About |
| `/privacy-policy`, `/terms-conditions`, `/payment-cancellation` | not in Figma | Built in the same style from the legal text captured earlier, under `/conditions/...` URLs as on the old site |

2. **Navigation and footer.** Header: Home, About, Works, Contact Us (Blogs is reachable from the footer only). Footer: Work, Blogs, Contact; LinkedIn, Instagram, Twitter / X; legal links; large "SACH" watermark; contact `hi@sach.studio` and `+91 6360 809 874`.
3. **Categories** are four, not five: Website & Landing Pages, Mobile Apps, Web Apps & Dashboard, Logo & Branding. Each project also has a status label: a date, LIVE, ONGOING or CONCEPT.
4. **Booking** uses a Cal.com embed (15 Min Meeting), not Calendly. The owner's Cal.com link is an environment value to supply.
5. **Tokens** (from the owner's palette, replacing the measured Framer values):
   - Neutral: 50 `#f8fafc`, 100 `#f1f5f9`, 200 `#e2e8f0`, 300 `#cbd5e1`, 400 `#94a3b8`, 500 `#64748b`, 600 `#475569`, 700 `#334155`, 800 `#1e293b`, 900 `#0f172a`, 950 `#020617`.
   - Blue: 50 `#eff6ff`, 100 `#dbeafe`, 200 `#bfdbfe`, 300 `#93c5fd`, 400 `#84b0fb` (as supplied; likely a typo for `#60a5fa`, builder to confirm with the owner), 500 `#2e5bff` (primary), 600 `#073cff`, 700 `#0030de`, 800 `#0027b7`, 900 `#001f90`, 950 `#001668`.
   - Fonts: Instrument Serif (headings, prices, stats, FAQ questions) and Outfit (body, buttons, nav). Switzer is dropped.
6. **Case-study template** (from the four designed frames): title; one-line subtitle; hero image (device mockup on a brand-coloured gradient); client logo; up to 4 tag chips; "View Figma design" button; second button "Live website" or "Live soon"; About; a wide banner image; Problem Statement (intro plus 5 bullets, each a bold lead and a sentence); Solutions (intro plus bullets); one or more feature images; Results (paragraph plus 3 stats); gallery images; Conclusion; "More like this" (3 other case studies). This replaces the case-study fields in the Data section.
7. **SEO fields per page.** The Figma file carries per-case-study meta title (≤55 chars), meta description (≤157 chars), URL slug and a listing-card summary. The panel exposes these four fields and the site uses them for metadata and the Works grid.
8. **Content that exists in Figma but not on Framer:** a fourth full case study (Cosmion Community Clubhouse), the Thank You page, and different slugs and titles. Slugs from Figma: `hasiru-dala-innovations-website-redesign`, `gulf-cv-writers-website-design`, `cosmion-community-clubhouse-website-design`; Master Systems and Arizona slugs are not given, so I will use `master-systems-maritime-automation-website` and `arizona-investment-management-dashboard`. Arizona has no case study in Figma (listed as CONCEPT with an Explore Project link only), so it appears in the grid and has no detail page.
9. **Known gaps in the Figma file** (flagged, not guessed): Master Systems' Problem Statement repeats the Hasiru Dala text; the blog detail body repeats an "About Master Systems" block; blog titles and dates differ between frames (10 Feb 2025 in the list, 21 April 2026 on the detail page); the Cal.com embed shows a sample January 2026 calendar.
10. **Assets.** The frames are flat in Figma (no individual layers readable through the API), so images cannot be pulled as separate files. I will crop them from 1x renders of each frame (hero photo, founder photo, 4 project previews, case-study hero images, 3 process illustrations, 4 value icons, client logos, testimonial avatars, blog covers). These crops are good enough to build and review. For a production launch the owner should export the originals from Figma at 2x; I will keep every image in one folder with stable names so they can be swapped without code changes.

## Intent and why

Sach Studio's site lives on Framer (https://spicy-humans-967067.framer.app/). The owner hit scaling limits there and wants the site rebuilt as code, deployed on Vercel, with an admin panel to upload case studies without touching code. Blog posts have the same need, and three of the four posts are empty today, so the panel covers both.

The public site must look and feel like the current one (same fonts, colours, copy, page structure) so nothing is lost in the move. The gain is ownership, speed that does not degrade as content grows, and a content workflow that is theirs.

## Goals

1. Rebuild every existing page, 19 URLs, in Next.js with the same look and copy.
2. An `/admin` panel, login-protected, to create, edit, publish, unpublish and delete case studies and blog posts, including image upload.
3. Public pages pre-built as static HTML and refreshed only for the page that changed when something is published.
4. Deploy on Vercel with Neon Postgres (content), Vercel Blob (images) and Clerk (admin login).
5. Fully responsive (desktop, tablet, mobile), keyboard accessible, reduced-motion respected.

## Non-goals

- Editing the home page, pricing, testimonials, FAQ or legal text in the panel. These live in code (`src/content/`) and change by editing a file.
- A contact form backend. Neither the Framer site nor the Figma design has a form; booking goes through Cal.com. The Thank You page is the page Cal.com redirects to after a booking.
- Multi-user roles, comments, scheduled publishing, versions, search.
- Migrating Framer's hosting, domain or analytics settings.

## Anti-goals (would make this a failure even if it works)

- A redesign. This is a faithful rebuild, not a fresh look.
- Placeholder text passing as real. Anything I write that was not on the source site is flagged as placeholder in the admin and in this document.
- A mock database or fake login. Data and auth use the real services.

## Constraints

- Static-first: public routes must not hit the database per request.
- The owner approves all Vercel integration installs in their own account; I cannot do those for them.
- The Vercel CLI is not installed on this machine yet.
- Work happens in a scratch folder the app made for this session. The owner can move it to a permanent folder once the work is worth keeping.

## Approaches considered

| | What | Trade-off |
|---|---|---|
| **A. Own panel inside the Next.js site** (chosen) | `/admin` in the same project. Neon Postgres for text, Vercel Blob for images, Clerk for login limited to the owner's email. | Most code to write; full ownership, no CMS fee, case-study layout is exactly ours. |
| B. Hosted CMS (Sanity or similar) | Site reads from the CMS, which supplies the editor. | Fastest; not the owner's own panel, and the editing format constrains the layout. |
| C. Plain React plus separate API | Single-page app with its own backend. | More to maintain, weaker SEO, no upside over A. |

The owner chose A. They proposed "React"; I adjusted that to Next.js (React framework) because a plain browser-rendered React app is worse for search on a marketing site.

## What was found on the source site

### Pages (19)

| Route | Content |
|---|---|
| `/` | Hero, stats (8+ years, 100+ sites, 10+ team), logo strip, filtered work grid (4 cards), 3-step process, pricing (4 plans), "Why you'll love us" (4 feature cards plus pain-point list), tech marquee, 6 testimonials, FAQ (6), booking call-to-action, footer |
| `/about-us` | Intro, stats, founder message (Sachin), 4 values, booking CTA |
| `/project` | "Explore Our Works", filter chips (All, Websites, WebApp & Dashboard, Mobile App, Logos & Branding, Creative & Consulting), project cards |
| `/projects/[slug]` x4 | Case study template; only Hasiru Dala is complete |
| `/blogs` | List of 4 posts |
| `/blogs/[slug]` x4 | Post template; only "Why Design Matters" has body text, and it is pasted Master Systems copy |
| `/contact-us` | "Book a 15-min call" plus FAQ (6 items, 1 answer visible) |
| `/conditions/privacy-policy`, `/terms-conditions`, `/payment-cancellation` | Full legal text captured |

Slugs: the source uses `why-design-matters`, `why-design-matters-copy`, and so on for the posts. I will use clean slugs (`why-design-matters`, `use-of-ai`, `importance-of-marketing`, `use-of-social-media`) and redirect the old `-copy` URLs.

### Design tokens (read from the live site)

- Headings: Instrument Serif 400, 54px/54px, tight tracking.
- Body: Outfit 300, 16px/30px, colour `rgba(15,23,42,0.7)`.
- Nav: Switzer 500, 14px.
- Page background `#F9F9F9`; ink `#0F172A`; accent blue `#2D5BFF`; also in use `#0FBD52` (status dot), `#1EC7D6`, `#DCEBFF`, `#EAF2FB`, `#93C5FD`, `#EEF5FE`.
- Hero: pale-blue sky gradient fading to the page background, floating pill nav, "Accepting new projects" green-dot badge, primary blue button and outlined secondary button.
- Motion on the source: hero text reveal, letter-by-letter button label, scrolling tech marquee, looping "Let's Work Together ✦" footer band.

### Content problems in the source (fixed or flagged in the rebuild)

- Three case studies (Arizona, Gulf CV Writers, Master Systems) have only a hero and a "View Figma design" button.
- Three blog posts have no body; "Why Design Matters" holds pasted Master Systems text.
- 5 of 6 FAQ answers were not captured (collapsed). Only "How long does a project take?" is known.
- Privacy page email typo `hi@sach.stuido` becomes `hi@sach.studio`.
- Social links point to generic X, LinkedIn and Dribbble home pages. They become configurable and are marked as needing the real profile URLs.
- Non-home pages have the title "My Framer Site". Real per-page titles and descriptions are added.

## The design

### Stack

Next.js (App Router) and TypeScript; Tailwind CSS for styling; Drizzle ORM on Neon Postgres; `@vercel/blob` for images (client upload, so large files skip the server); Clerk for admin login with an email allowlist; deployed on Vercel.

### Rendering

Public pages are statically generated. Publishing, editing or deleting in the panel revalidates the affected pages by cache tag, so the site updates in seconds without a rebuild. Only published entries are public.

### Data

`case_studies`: id, slug (unique), title, subtitle, client_name, category (one of the five), cover_image_url, figma_url, about, problem_intro, problems (list of title and text), solution_intro, solutions (list of title and text), results_summary, stats (up to 3: value and label), conclusion, gallery (list of image URLs with alt text), is_featured, status (draft or published), is_placeholder, published_at, created_at, updated_at.

`blog_posts`: id, slug (unique), title, excerpt, cover_image_url, body (Markdown), status, is_placeholder, published_at, created_at, updated_at.

Images are stored in Blob; the database holds URLs only.

### Admin panel (`/admin`)

- Login via Clerk; any signed-in user whose email is not on the allowlist (environment variable) sees "not authorised".
- Dashboard with two lists (case studies, blog posts) showing title, status, last edited, and a "Needs content" badge for placeholders.
- Case-study editor: structured form matching the fields above, drag-to-reorder for problems, solutions and gallery, image upload with preview, slug auto-generated and editable, live preview of the public page, Save draft, Publish, Unpublish, Delete (with confirmation).
- Blog editor: title, excerpt, cover, Markdown body with preview, same actions.
- Errors say what went wrong and how to fix it; actions keep one name through the flow ("Publish" produces "Published").

### Public site structure

Shared header (floating pill nav), shared footer (contact, links, legal, looping band), booking CTA block reused on four pages. Home sections are components that read static content from `src/content/`. The work grid on `/` shows featured published case studies; `/project` shows all, with client-side filtering by category.

### Seed content

On first deploy a seed script inserts the four case studies and four posts. Hasiru Dala is inserted in full from the source. The other three case studies and the four posts get placeholder bodies, `is_placeholder = true`, status published so the grid matches today's site, with a "Needs content" badge in the admin so none is forgotten.

## Decided by the owner

- Rebuild as code on Vercel; reason: Framer scaling.
- Build an admin panel to upload case studies (blogs added with their agreement).
- Option A above.

## My calls (the owner can overturn any)

1. Next.js, Tailwind, Drizzle, Neon, Blob, Clerk, as above.
2. Static content (pricing, testimonials, FAQ, legal) lives in code, not in the panel.
3. Clean blog slugs with redirects from the old `-copy` ones.
4. Placeholder copy for the empty case studies, posts and 5 FAQ answers, flagged as placeholder.
5. Source images are downloaded from Framer's CDN into the project (`public/` for site images, Blob for case-study images) so the site does not depend on Framer after launch.
6. Fonts: Instrument Serif and Outfit through `next/font` (superseded the Switzer call).
7. The Cal.com booking link and social profile URLs are environment or content values the owner fills in; until then the booking embed shows the sample calendar link as a placeholder and social links point to the contact page.
8. Per-page titles, descriptions, Open Graph tags, sitemap and robots file added (the source has none).

## Left to the builder

Component breakdown, CSS details to match measured values, animation implementations, form validation details, seed script mechanics, and file layout.

## Delivery order and checks

1. Scaffold, tokens, fonts, layout shell.
2. Public pages with content in code (home, about, work, contact, legal, blogs, case-study templates fed by seed data).
3. Data layer and admin panel.
4. Provision Neon, Blob, Clerk (needs the owner: install Vercel CLI, approve integrations), connect, seed.
5. Deploy to Vercel.

Done means: `next build` passes; all 19 routes render with no console errors at 375, 768 and 1440 widths; keyboard navigation works; admin can create, edit, publish and delete a case study with an uploaded image and the public page updates; reduced-motion setting disables non-essential animation.

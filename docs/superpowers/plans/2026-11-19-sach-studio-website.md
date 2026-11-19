# Sach Studio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Sach Studio site from the owner's Figma design as a Next.js app on Vercel, with a login-protected `/admin` panel to create, edit, publish and delete case studies and blog posts.

**Architecture:** One Next.js App Router project. Public pages are statically generated; content lives in Neon Postgres and images in Vercel Blob; publishing in the panel revalidates cache tags so only affected pages refresh. Static marketing copy (pricing, testimonials, FAQ, legal) lives in `src/content/`. Admin login is Clerk, limited to an email allowlist.

**Tech Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Drizzle ORM, `@neondatabase/serverless`, `@vercel/blob`, `@clerk/nextjs`, Zod, Vitest and Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-19-sach-studio-website-design.md` (the "Revision" section at the top wins over anything below it). Visual target: Figma file `Wa3XfhzicxVGMS9NdhdqWD`, frames listed in the spec; 1x renders are saved in `design/figma-renders/` (Task 2).

## Global Constraints

- Figma is the visual source of truth; canvas 1920px wide, content column 1300px (`max-w-[1300px]`), page background Neutral 50 `#f8fafc` (the Figma pages read as near-white grey).
- Fonts: Instrument Serif (headings, prices, stats, FAQ questions) and Outfit (body, buttons, nav), through `next/font`. No Switzer.
- Colours exactly as supplied: Neutral 50 `#f8fafc`, 100 `#f1f5f9`, 200 `#e2e8f0`, 300 `#cbd5e1`, 400 `#94a3b8`, 500 `#64748b`, 600 `#475569`, 700 `#334155`, 800 `#1e293b`, 900 `#0f172a`, 950 `#020617`; Blue 50 `#eff6ff`, 100 `#dbeafe`, 200 `#bfdbfe`, 300 `#93c5fd`, 400 `#84b0fb`, 500 `#2e5bff` (primary), 600 `#073cff`, 700 `#0030de`, 800 `#0027b7`, 900 `#001f90`, 950 `#001668`.
- Header nav: Home, About, Works, Contact Us. Footer links: Work, Blogs, Contact, LinkedIn, Instagram, Twitter / X, Privacy Policy, Terms & Conditions, Payment & Cancellation. Contact: `hi@sach.studio`, `+91 6360 809 874`.
- Works categories (exactly four): `Website & Landing Pages`, `Mobile Apps`, `Web Apps & Dashboard`, `Logo & Branding`. Project status labels: a date, `LIVE`, `ONGOING`, `CONCEPT`.
- Booking is a Cal.com embed; its link comes from `NEXT_PUBLIC_CAL_LINK`.
- SEO limits per case study: meta title at most 55 characters, meta description at most 157.
- Public routes never query the database per request: static generation with tag revalidation.
- Only `published` rows are public. Admin is reachable only by signed-in users whose email is in `ADMIN_EMAILS`.
- Node 20.9 or newer. No mock database, no fake login.
- Respect `prefers-reduced-motion`; visible keyboard focus; responsive at 375, 768 and 1440 widths.
- Any text not in the Figma frames or the captured Framer copy is placeholder, stored with `isPlaceholder = true` where it is database content, and listed in `docs/placeholder-content.md`.

## Review Focus

1. A draft or unpublished case study or post requested by its URL returns 404 and never appears in lists, sitemap or "More like this".
2. Creating or renaming to a slug that already exists is rejected with a message naming the clash; the editor keeps what the user typed.
3. A signed-in user not on the allowlist gets a 403 page on `/admin` and a 403 JSON error from admin actions and the upload route, with no content leaked.
4. Uploading a non-image, an image over 8 MB, or an unsupported type is rejected before anything is stored, with a message saying the limit.
5. Works with zero published items, or a category with none, shows an empty state that says what to do instead of a blank grid; unpublishing or deleting a case study removes it from the grid, "More like this", and its own URL.

---

### Task 1: Scaffold, tokens and tooling

**Files:**
- Create: project files at the repo root (`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`), `src/app/layout.tsx`, `src/app/globals.css`, `src/lib/fonts.ts`, `src/lib/categories.ts`, `.env.example`
- Move: `public/brand/sach-studio-logo.svg` stays where it is
- Test: `src/lib/categories.test.ts`

**Interfaces:**
- Produces: CSS tokens in `globals.css` (`@theme` with `--color-neutral-*`, `--color-blue-*`, `--font-serif`, `--font-sans`); `CATEGORIES: readonly { slug: CategorySlug; label: string }[]`; `type CategorySlug = 'websites' | 'mobile-apps' | 'web-apps-dashboard' | 'logo-branding'`; `categoryLabel(slug: CategorySlug): string`; `isCategorySlug(v: string): v is CategorySlug`.

- [ ] **Step 1:** In the repo root run `git init`. Scaffold with `npx create-next-app@latest` (TypeScript, Tailwind, App Router, `src/` dir, ESLint, Turbopack) into a temporary folder and move its contents into the root, keeping `docs/` and `public/brand/`. Add dev dependencies `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@playwright/test`, `sharp`, `zod`.
- [ ] **Step 2: Write the failing test** `categories.test.ts`: `CATEGORIES` has exactly 4 entries with labels `Website & Landing Pages`, `Mobile Apps`, `Web Apps & Dashboard`, `Logo & Branding` in that order; `isCategorySlug('websites')` is true and `isCategorySlug('branding')` is false; `categoryLabel('mobile-apps')` is `Mobile Apps`.
- [ ] **Step 3:** Run `npx vitest run src/lib/categories.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 4:** Implement `src/lib/categories.ts`.
- [ ] **Step 5:** Put the supplied palette in `globals.css` `@theme`, load Instrument Serif (weight 400) and Outfit (weights 300, 400, 500, 600) in `fonts.ts`, apply `font-sans` on `body` and background `neutral-50`. Add `.env.example` listing `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `ADMIN_EMAILS`, `NEXT_PUBLIC_CAL_LINK`, `NEXT_PUBLIC_SITE_URL`.
- [ ] **Step 6:** Run `npx vitest run` and `npm run build`. Expected: tests PASS, build succeeds.
- [ ] **Step 7:** Commit `chore: scaffold Next.js app with Sach Studio tokens`.

### Task 2: Image assets cropped from the Figma renders

**Files:**
- Create: `design/figma-renders/*.png` (copies of the 12 frame renders: home, about, projects, webapps, contact, hdi, gulf, cosmion, master, blogdetail, blogs, thanks; gitignored), `scripts/crop-assets.mjs`, `scripts/assets.manifest.json`, `public/images/**`, `docs/assets-to-replace.md`
- Test: `scripts/crop-assets.test.ts`

**Interfaces:**
- Produces: `public/images/<group>/<name>.png|webp` with stable names used by later tasks: `hero/hero-photo`, `about/founder`, `logos/gulf-cv-writers`, `logos/hasiru-dala`, `logos/master-systems`, `logos/cosmion`, `projects/<project-slug>-card` and `projects/<project-slug>-hero`, `process/step-1|2|3`, `values/quality|communication|growth|design`, `testimonials/avatar-1..6`, `blogs/<slug>-cover`; `docs/assets-to-replace.md` lists each file with its source frame and pixel box.
- `scripts/crop-assets.mjs` exports `cropAll(manifestPath: string, renderDir: string, outDir: string): Promise<{written: string[]; failed: {out: string; reason: string}[]}>`; manifest entries are `{frame, x, y, w, h, out, format?}`.

- [ ] **Step 1: Write the failing test:** with a 100x100 synthetic PNG and a manifest of two entries (one valid, one with a box outside the image), `cropAll` writes the valid file with the requested size and returns the other under `failed` with a reason naming the out-of-bounds box.
- [ ] **Step 2:** Run it; expected FAIL.
- [ ] **Step 3:** Implement `cropAll` with `sharp.extract`, validating the box before cropping.
- [ ] **Step 4:** Copy the renders into `design/figma-renders/`, read coordinates from the renders (1x pixel space, content column x from 310 to 1610), write the manifest, run the script, and open each output to confirm it shows the right region with no text bleed. Add `docs/assets-to-replace.md`.
- [ ] **Step 5:** Run `npx vitest run scripts` (PASS). Commit `feat: crop design assets from Figma renders`.

### Task 3: UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `Pill.tsx`, `SectionHeading.tsx`, `Tabs.tsx`, `Accordion.tsx`, `Card.tsx`, `src/components/ui/index.ts`
- Test: `src/components/ui/Tabs.test.tsx`, `Accordion.test.tsx`, `Button.test.tsx`

**Interfaces:**
- Produces:
  - `Button({ variant: 'primary' | 'outline' | 'link'; href?: string; onClick?; children; fullWidth?; icon?: ReactNode })`: primary is the blue pill with the `blue-600` gradient and soft blue shadow; renders `<a>` with `href`, else `<button type="button">`.
  - `Pill({ tone: 'green' | 'blue' | 'neutral'; children })`: the "Accepting new projects" green badge and tag chips.
  - `SectionHeading({ title: string; subtitle?: string; align?: 'center' | 'left'; accent?: string })`: Instrument Serif title, Outfit light subtitle; `accent` renders that trailing text in `blue-500` (used on hero titles such as "Explore Our Works").
  - `Tabs<T extends string>({ items: {value: T; label: string}[]; value: T; onChange: (v: T) => void })`: segmented control, `role="tablist"`, arrow-key navigation, selected tab in `blue-500` text on white.
  - `Accordion({ items: {id: string; question: string; answer: string}[]; defaultOpenId?: string })`: single-open, `aria-expanded` and `aria-controls`, first item open by default.
  - `Card({ children; className? })`: white, 1px `neutral-200` border, large radius, soft shadow.

- [ ] **Step 1: Write failing tests:** Tabs: clicking a tab calls `onChange` with its value; ArrowRight moves selection to the next tab. Accordion: first item open initially; clicking another closes the first and opens that one; the trigger has `aria-expanded="true"` only on the open one. Button: with `href` renders a link, without renders a `type="button"`.
- [ ] **Step 2:** Run `npx vitest run src/components/ui`; expected FAIL.
- [ ] **Step 3:** Implement the components to the Figma look (compare against `design/figma-renders/home.png`).
- [ ] **Step 4:** Run the tests; expected PASS. Commit `feat: add UI primitives`.

### Task 4: Site shell (header, footer, marquee, booking)

**Files:**
- Create: `src/app/(site)/layout.tsx`, `src/components/layout/Header.tsx`, `Footer.tsx`, `Marquee.tsx`, `BookingSection.tsx`, `CalEmbed.tsx`, `src/content/site.ts`
- Test: `src/components/layout/Header.test.tsx`, `CalEmbed.test.tsx`

**Interfaces:**
- Consumes: `Button`, `SectionHeading` from Task 3.
- Produces:
  - `site` in `src/content/site.ts`: `{ name; email; phone; nav: {label; href}[]; footerLinks: {label; href}[]; social: {label; href}[]; legal: {label; href}[] }` with the Global Constraints values; nav hrefs `/`, `/about`, `/works`, `/contact`; legal hrefs `/conditions/privacy-policy`, `/conditions/terms-conditions`, `/conditions/payment-cancellation`.
  - `Header({ currentPath: string })`: floating pill nav with the logo (`/brand/sach-studio-logo.svg`), active link in `blue-500`; collapses to a menu button under 768px.
  - `Footer()`: logo, tagline "Premium Design & Development Studio", contact, link columns, legal row, "Built By ♥ Sach.Studio", copyright "© 2026 SACH STUDIO. ALL RIGHTS RESERVED.", gradient background and the large translucent "SACH" watermark.
  - `Marquee()`: the looping "LET'S *WORK TOGETHER* ✦" band, paused under reduced motion.
  - `CalEmbed({ calLink?: string })`: renders the Cal.com inline embed for `calLink ?? process.env.NEXT_PUBLIC_CAL_LINK`; when neither exists renders a visible card saying the booking link is not set and naming the variable.
  - `BookingSection()`: "Book a 15-min call" heading, subtitle, then `CalEmbed`.

- [ ] **Step 1: Write failing tests:** Header renders four nav links with the exact labels, marks the one matching `currentPath` with `aria-current="page"`, and shows a menu button at narrow width (mock `matchMedia`) that toggles the links. CalEmbed with no link renders the "not set" message naming `NEXT_PUBLIC_CAL_LINK`.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement, then wire `(site)/layout.tsx` with Header, `children`, Marquee, Footer. Load the Cal.com embed script lazily on the client.
- [ ] **Step 4:** Run the tests (PASS) and start `npm run dev`; compare header and footer with `home.png` at 1440 and 375 widths. Commit `feat: add site shell`.

### Task 5: Home page (static sections)

**Files:**
- Create: `src/app/(site)/page.tsx`, `src/components/home/Hero.tsx`, `Stats.tsx`, `ClientLogos.tsx`, `Process.tsx`, `Pricing.tsx`, `WhyUs.tsx`, `Testimonials.tsx`, `Faq.tsx`, `src/content/home.ts`, `src/content/faqs.ts`
- Test: `src/components/home/Testimonials.test.tsx`, `Pricing.test.tsx`

**Interfaces:**
- Consumes: Task 3 and Task 4 components, assets from Task 2.
- Produces: `home` content object with `hero`, `stats` (`8+ Years of Experience`, `100+ Websites Built`, `10+ Experts in Team`), `process` (three steps with durations `1-2 Days`, `30 - 45 Days`, `5-10 Days`), `pricing` (four plans with the prices and feature lists from the Figma Home frame), `whyUs`, `testimonials` (six: name, role, tag, quote, avatar); `faqs: FaqItem[]` (`{id; question; answer}`, six for Home, five for Contact); `Testimonials` is a two-up slider with previous and next buttons.
- Exposes a `featuredWork` slot in `page.tsx` (rendered by Task 8's `FeaturedWork`).

- [ ] **Step 1: Write failing tests:** Pricing renders four plans with prices `$1,999`, `$2,999`, `$3,999`, `$3,999` and a "Book a 15min call" button each. Testimonials: next button advances to the following pair, the previous button is disabled on the first pair, and the last pair disables next.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement every Home section to match `home.png` strip by strip. Hero: green "Accepting new projects" pill, title "We Build High-Performing" with blue second line "Mobile App, Web App & Dashboards", the two buttons, and the hero photo card. FAQ answers: the first is the captured Framer text; the other five Home answers and the five Contact answers are written to match the questions and recorded in `docs/placeholder-content.md`.
- [ ] **Step 4:** Run tests (PASS) and compare the page against `home.png` at 1440, 768 and 375. Commit `feat: add Home page sections`.

### Task 6: About, Contact, Thank You and legal pages

**Files:**
- Create: `src/app/(site)/about/page.tsx`, `contact/page.tsx`, `thank-you/page.tsx`, `conditions/[doc]/page.tsx`, `src/content/about.ts`, `src/content/legal.ts`, `src/components/about/FounderMessage.tsx`, `Values.tsx`
- Test: `src/content/legal.test.ts`

**Interfaces:**
- Consumes: Task 3 to 5 components.
- Produces: `legalDocs: Record<'privacy-policy' | 'terms-conditions' | 'payment-cancellation', { title: string; description: string; updated: string; sections: { heading: string; body: string[]; list?: string[] }[] }>`; `generateStaticParams` for `conditions/[doc]`; unknown `doc` returns `notFound()`.

- [ ] **Step 1: Write failing tests:** `legalDocs` has exactly the three keys; every `sections[].heading` is non-empty; no document contains the string `stuido`; privacy-policy ends with contact `hi@sach.studio`.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Move the captured legal text into `legal.ts`, correcting the privacy email typo. Build About (hero "Sach Studio is where bold ideas turn into **Real Growth**", stats, logos, founder message with photo, four values with icons, booking) and Contact (hero "Book a **15-min call**", `CalEmbed`, FAQ) and Thank You ("Message received" pill, praying-hands mark, "Thank You!", "Let's Create Something Remarkable.", copy, "Know more about us" button to `/about`) from their frames.
- [ ] **Step 4:** Run tests (PASS); visit each route; check titles. Commit `feat: add About, Contact, Thank You and legal pages`.

### Task 7: Provision services, schema, seed and queries

**Needs the owner:** install the Vercel CLI (`npm i -g vercel`), run `vercel link`, and approve the Neon, Blob and Clerk installs. Stop and ask when a step needs the owner's account.

**Files:**
- Create: `src/db/schema.ts`, `src/db/index.ts`, `src/db/queries.ts`, `drizzle.config.ts`, `scripts/seed.ts`, `src/lib/slug.ts`, `src/lib/validation.ts`, `docs/placeholder-content.md`
- Test: `src/lib/slug.test.ts`, `src/lib/validation.test.ts`, `src/db/queries.test.ts`

**Interfaces:**
- Produces:
  - Tables `case_studies` and `blog_posts` per the spec, with the revised case-study columns: `id, slug (unique), title, subtitle, clientName, clientLogoUrl, category: CategorySlug, tags: string[], statusLabel: 'LIVE'|'ONGOING'|'CONCEPT'|null, displayDate: string|null, heroImageUrl, cardImageUrl, figmaUrl, liveUrl, about, bannerImageUrl, problemIntro, problems: {lead: string; text: string}[], solutionIntro, solutions: {lead: string; text: string}[], featureImages: string[], resultsText, stats: {value: string; label: string}[], galleryImages: string[], conclusion, summary, metaTitle, metaDescription, isFeatured, status: 'draft'|'published', isPlaceholder, publishedAt, createdAt, updatedAt`; `blog_posts`: `id, slug, title, excerpt, coverImageUrl, body (markdown), displayDate, status, isPlaceholder, publishedAt, createdAt, updatedAt`.
  - `getDb()` (lazy, no Proxy).
  - Queries: `listPublishedCaseStudies(opts?: {category?: CategorySlug; featuredOnly?: boolean}): Promise<CaseStudy[]>`, `getPublishedCaseStudy(slug): Promise<CaseStudy | null>`, `listRelatedCaseStudies(slug, limit = 3): Promise<CaseStudy[]>`, `listPublishedPosts()`, `getPublishedPost(slug)`, and admin versions `adminListCaseStudies()`, `adminGetCaseStudy(id)`, `saveCaseStudy(input: CaseStudyInput): Promise<{ok: true; id: string} | {ok: false; error: string}>`, `setCaseStudyStatus(id, status)`, `deleteCaseStudy(id)`, and the same set for posts. Cache tags: `case-studies`, `case-study:<slug>`, `posts`, `post:<slug>`.
  - `slugify(input: string): string`; `caseStudyInputSchema` and `postInputSchema` (Zod) enforcing `metaTitle.length <= 55`, `metaDescription.length <= 157`, at most 3 stats, at most 4 tags, valid category, slug matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

- [ ] **Step 1:** `vercel link`; `vercel integration add neon`, `vercel integration add clerk`, and create a Blob store (dashboard or `vercel blob`); `vercel env pull .env.local --yes`. Confirm env var names only (never print values).
- [ ] **Step 2: Write failing tests:** `slugify('Master Systems: Visualizing Marine Automated Solutions')` is `master-systems-visualizing-marine-automated-solutions`; `slugify('  --Hello__World!! ')` is `hello-world`; validation rejects a 56-character `metaTitle` with an error naming the field and limit, rejects 4 stats and a slug with capitals; `queries.test.ts` (against a Neon branch or a test schema via `DATABASE_URL`) proves Review Focus 1 and 2: a draft is absent from `listPublishedCaseStudies` and `getPublishedCaseStudy`, and `saveCaseStudy` with a taken slug returns `{ok: false}` with an error containing the slug.
- [ ] **Step 3:** Run `npx vitest run src/lib src/db`; expected FAIL.
- [ ] **Step 4:** Implement schema, `drizzle-kit push` (load `.env.local` with `dotenv-cli`), slug, validation and queries.
- [ ] **Step 5:** Implement `scripts/seed.ts`: Hasiru Dala, Gulf CV Writers, Cosmion and Master Systems from their Figma frames (read the text from the 1x renders at full size; Master Systems' Problem Statement is the Figma placeholder, so write real text for it and mark `isPlaceholder`), Arizona as a CONCEPT card without a detail page (`liveUrl` null, no body fields), and four blog posts with the Figma titles, covers and dates, bodies as placeholders. Run it twice to confirm it is idempotent (upsert by slug).
- [ ] **Step 6:** Run tests (PASS). Commit `feat: add data layer, seed and queries`.

### Task 8: Works, case studies, blogs and the Home grid

**Files:**
- Create: `src/app/(site)/works/page.tsx`, `works/[slug]/page.tsx`, `blogs/page.tsx`, `blogs/[slug]/page.tsx`, `src/components/works/ProjectCard.tsx`, `ProjectGrid.tsx`, `FeaturedWork.tsx`, `CaseStudyView.tsx`, `src/components/blogs/PostCard.tsx`, `PostBody.tsx`
- Test: `src/components/works/ProjectGrid.test.tsx`, `src/app/works.routes.test.ts`

**Interfaces:**
- Consumes: Task 7 queries, Task 3 `Tabs`.
- Produces: `ProjectGrid({ projects: ProjectCardData[]; initialCategory?: CategorySlug; pageSize?: number })` (client component; category tabs, "Load more" revealing `pageSize` more, default 4); `FeaturedWork({ projects })` for Home (first project as the wide card, three below, "View our work" button); `CaseStudyView({ study: CaseStudy; related: CaseStudy[] })`. `works/page.tsx` reads `?category=` and validates it with `isCategorySlug`, falling back to the first category. All routes use `generateStaticParams` and `revalidate` by tag; unknown or unpublished slugs call `notFound()`. Blog body renders Markdown with `react-markdown`.

- [ ] **Step 1: Write failing tests:** ProjectGrid: tab click filters to that category; a category with no projects shows an empty state with the text "No projects in this category yet"; with 6 projects and `pageSize` 4, Load more reveals the remaining 2 and then disappears. Route test: `getPublishedCaseStudy('does-not-exist')` path calls `notFound` (Review Focus 1 and 5).
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement to match `projects.png`, `webapps.png`, the four case-study frames, `blogs.png` and `blogdetail.png`; wire `FeaturedWork` into Home.
- [ ] **Step 4:** Run tests (PASS); open each route at 1440 and 375. Commit `feat: add Works, case study and blog pages`.

### Task 9: Admin sign-in and protection

**Files:**
- Create: `src/proxy.ts` (Clerk middleware; named `middleware.ts` if the installed Next version still expects that), `src/lib/admin-auth.ts`, `src/app/admin/sign-in/[[...sign-in]]/page.tsx`, `src/app/admin/(protected)/layout.tsx`, `src/app/admin/forbidden/page.tsx`
- Modify: `src/app/layout.tsx` (wrap `ClerkProvider` inside `<body>`)
- Test: `src/lib/admin-auth.test.ts`

**Interfaces:**
- Produces: `isAdminEmail(email: string | null | undefined, allowlist?: string): boolean` (case-insensitive, trims, reads `ADMIN_EMAILS` comma list, empty allowlist means nobody); `requireAdmin(): Promise<{ userId: string; email: string }>` throws a `Forbidden` error (name `'Forbidden'`) for signed-out or non-allowlisted users; `AdminForbiddenError`.

- [ ] **Step 1: Write failing tests:** `isAdminEmail('Owner@Sach.studio', 'owner@sach.studio, other@x.com')` is true; `isAdminEmail('a@b.com', '')` is false; `isAdminEmail(null, 'a@b.com')` is false.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement; protect `/admin(.*)` except sign-in; the protected layout calls `requireAdmin()` and redirects non-allowlisted users to `/admin/forbidden` (Review Focus 3). Set `ADMIN_EMAILS` locally to the owner's email.
- [ ] **Step 4:** Run tests (PASS); check signed-out redirect, allowlisted access and a non-allowlisted account. Commit `feat: protect admin with Clerk and allowlist`.

### Task 10: Admin editors and image upload

**Files:**
- Create: `src/app/admin/(protected)/page.tsx` (dashboard), `case-studies/new/page.tsx`, `case-studies/[id]/page.tsx`, `posts/new/page.tsx`, `posts/[id]/page.tsx`, `src/app/admin/actions.ts`, `src/app/api/upload/route.ts`, `src/components/admin/CaseStudyForm.tsx`, `PostForm.tsx`, `ImageField.tsx`, `ListField.tsx`, `StatusBadge.tsx`, `src/lib/upload-rules.ts`, `src/lib/revalidate.ts`
- Test: `src/lib/upload-rules.test.ts`, `src/components/admin/ListField.test.tsx`, `src/app/admin/actions.test.ts`

**Interfaces:**
- Consumes: Task 7 queries and schemas, Task 9 `requireAdmin`.
- Produces:
  - `validateUpload(file: {type: string; size: number}): {ok: true} | {ok: false; error: string}`; allowed types `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/avif`; max 8 MB; error strings like `Use a PNG, JPG, WebP, SVG or AVIF image` and `Images must be 8 MB or smaller; this one is 12.4 MB`.
  - `POST /api/upload` (Blob client-upload token endpoint): calls `requireAdmin()` and `validateUpload` before issuing a token; returns 403 JSON `{error: 'Not authorised'}` for non-admins.
  - Server actions `saveCaseStudyAction(input) `, `publishCaseStudyAction(id)`, `unpublishCaseStudyAction(id)`, `deleteCaseStudyAction(id)` and the post equivalents; each calls `requireAdmin()` first, returns `{ok: true, message} | {ok: false, error}`, messages `Saved`, `Published`, `Unpublished`, `Deleted`, and calls `revalidateContent(tags: string[])` for `case-studies`, `case-study:<slug>` (old and new slug on rename), `posts`, `post:<slug>`.
  - `ListField({ label; value: {lead: string; text: string}[]; onChange; max?: number })` with add, remove and up/down reorder (keyboard accessible).
  - Editors: structured form with the case-study fields in the spec's template order, auto-slug from the title until edited by hand, inline field errors from the Zod schema, "Save draft", "Publish", "Unpublish", "Delete" (confirmation dialog saying it cannot be undone), a "Needs content" badge when `isPlaceholder`, and a "Preview" link to the public URL (drafts preview through a signed `?preview` route checked by `requireAdmin`).

- [ ] **Step 1: Write failing tests:** `validateUpload({type: 'application/pdf', size: 100})` is rejected with the type message; `validateUpload({type: 'image/png', size: 12.4 * 1024 * 1024})` is rejected with the exact size message; a 2 MB PNG passes. `actions.test.ts`: with `requireAdmin` mocked to throw `Forbidden`, each action returns `{ok: false, error: 'Not authorised'}` without touching queries; with admin, publishing calls `revalidateContent` with both the list tag and the item tag. ListField: Add appends a blank row, move-down swaps rows, and Add is disabled at `max`.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement the rules, route, actions, fields and forms; dashboard lists both content types with title, status, last edited and badges.
- [ ] **Step 4:** Run tests (PASS). Manually: create a case study with an uploaded cover, publish it, confirm it appears on `/works` and `/works/<slug>` within seconds without a rebuild; unpublish and confirm 404; try a taken slug and an oversized file and confirm the messages (Review Focus 2, 4, 5). Commit `feat: add admin editors and image upload`.

### Task 11: SEO, redirects, end-to-end checks and deploy

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `e2e/public.spec.ts`, `e2e/admin.spec.ts`, `docs/README.md` (setup, env vars, how to add a case study, how to replace images)
- Modify: `next.config.ts` (redirects), each page's `generateMetadata`

**Interfaces:**
- Consumes: Task 7 queries.
- Produces: `sitemap()` listing static routes plus published case studies and posts only; redirects from the old Framer paths (`/about-us` to `/about`, `/project` to `/works`, `/contact-us` to `/contact`, `/projects/:slug` to `/works/:slug`, `/blogs/why-design-matters-copy` and the other `-copy` variants to their new slugs, `/conditions/*` unchanged); per-page title, description and Open Graph from the case study's `metaTitle` and `metaDescription`.

- [ ] **Step 1: Write failing e2e tests (Playwright):** every public route returns 200 with exactly one `h1` and no console errors at 375, 768 and 1440 widths; `/sitemap.xml` contains no draft slug; `/admin` redirects a signed-out visitor to sign-in; old URLs return 308 to the new ones.
- [ ] **Step 2:** Run `npx playwright test`; expected FAIL.
- [ ] **Step 3:** Implement sitemap, robots, redirects and metadata.
- [ ] **Step 4:** Run lint, unit tests, `npm run build` and Playwright; expected all PASS. Check reduced motion (marquee paused) and keyboard focus on header, tabs, accordion and admin forms.
- [ ] **Step 5:** `vercel deploy` for a preview; run the admin flow on the preview URL; then ask the owner before promoting to production or attaching their domain. Commit `feat: add SEO, redirects and e2e checks`.

---

## Self-review

- **Spec coverage:** pages and routes (Tasks 4 to 8), tokens and fonts (1), nav and footer (4), categories and statuses (1, 8), Cal.com booking (4, 6), case-study template and SEO fields (7, 8, 10), panel with draft, publish, unpublish and delete (10), Blob images (10), Clerk allowlist (9), redirects and slugs (11), placeholders listed (5, 7), asset crops and replacement note (2), legal pages (6), Thank You (6), reduced motion and responsive checks (4, 11).
- **Not covered by design:** Arizona detail page (spec says none); editing home, pricing, testimonials, FAQ or legal text in the panel (non-goal).
- **Type consistency:** `CategorySlug` (Task 1) is used by queries, `ProjectGrid` and schemas; `CaseStudyInput` comes from `caseStudyInputSchema` (Task 7) and is what `saveCaseStudyAction` accepts (Task 10); tag names match between queries (Task 7), actions (Task 10) and pages (Task 8).
- **Open owner inputs:** Cal.com link, social profile URLs, admin email, 2x image exports, Blue 400 value, real text for the placeholder content.

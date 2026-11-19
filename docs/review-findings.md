# Final review findings (not yet fixed)

A fresh reviewer read the whole branch (commits 09d088f..42c3a11). Tests, typecheck and lint passed for it (158 tests). The fix pass below was planned but NOT started; nothing here has been changed in the code.

## Critical: fix before any real deploy
1. **Images uploaded in the admin cannot show on the public site.** `next.config.ts` has no `images.remotePatterns` for Vercel Blob (`*.public.blob.vercel-storage.com`), so `next/image` rejects every uploaded image. Fix: add the pattern; restrict image addresses in `src/lib/validation.ts` (`imageRef`) to `/` paths (not `//`) and that Blob host; add a test that renders a card with a Blob URL.
2. **The admin allowlist is only checked in a layout.** `src/app/admin/(protected)/layout.tsx` calls `requireAdmin()`, but the pages under it read the database without checking. Next.js does not re-run a layout on in-app navigation, so a signed-in user who is not on `ADMIN_EMAILS` could fetch draft content. Fix: add a shared `gateAdmin()` (redirect to `/admin/sign-in` when signed out, `forbidden()` when not allowed) and call it first in every page under `(protected)`; add a test that scans those pages for it.

## Important
3. **`npm run db:seed` overwrites admin edits** (republishes unpublished items, resets text; docs wrongly call it safe). Fix: insert only slugs that are missing; add a `--force` option; correct `docs/README.md`.
4. **Unpublish discards unsaved edits.** The edit pages key the form on `updatedAt`, so a refresh remounts it. Fix: remove that `key` in `case-studies/[id]/page.tsx` and `posts/[id]/page.tsx`.
5. **"Show on the Home page" does nothing.** `isFeatured` is never read. Fix: sort featured projects first in `FeaturedWork` (add `sortFeaturedFirst` in `src/lib/projects.ts`) and reword the checkbox.
6. **`e2e/admin.spec.ts` expects HTTP 404 after unpublish**, but the site returns the not-found page with noindex and status 200. Fix the assertion.

## Minor (deferred)
Empty entries in image lists can publish blank cards; no redirect when a published slug is renamed; admins cannot set card order (`sortOrder`); low contrast on stat labels and "Live soon" (`text-neutral-400`); Tabs lack `aria-controls`/`tabpanel`; no styled `not-found.tsx` with header and footer; misleading comment in `upload-rules.ts`; refusal tests cover four of six actions; unauthenticated Server Action posts to public routes return 500 (fail closed).

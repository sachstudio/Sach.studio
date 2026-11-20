# Final review findings

A fresh reviewer read the whole branch (commits 09d088f..42c3a11). The Critical and Important findings were fixed afterwards, each with a test that failed first.

## Fixed
1. **Critical: uploaded images could not show on the public site.** `next.config.ts` now allows images from Vercel Blob (`*.public.blob.vercel-storage.com`) and nothing else; image addresses in the admin must be an upload or a site path (`/...`, not `//...`) (`src/lib/validation.ts`).
2. **Critical: the admin allowlist was only checked in a layout.** Every admin page and the layout now call `gateAdmin()` (`src/lib/admin-gate.ts`) before reading anything; a test scans the pages for it.
3. **Important: `db:seed` overwrote admin edits.** It now only inserts what is missing; `--force` resets starting items on purpose (`src/db/seed.ts`, `scripts/seed.ts`, `docs/README.md`).
4. **Important: Unpublish discarded unsaved edits.** The edit forms are no longer re-created when the saved date changes.
5. **Important: "Show on the Home page" did nothing.** Featured projects are now shown first in the Home project grid (`sortFeaturedFirst`), and the checkbox says so.
6. **Important: the signed-in admin e2e test asserted HTTP 404.** It now checks for the not-found page and the noindex tag.

## Minor (not done)
Empty entries in image lists can publish blank cards; no redirect when a published slug is renamed; admins cannot set card order (`sortOrder`); low contrast on stat labels and "Live soon" (`text-neutral-400`); Tabs lack `aria-controls`/`tabpanel`; no styled `not-found.tsx` with header and footer; a misleading comment in `upload-rules.ts`; refusal tests cover four of six actions; unauthenticated Server Action posts to public routes return 500 (fail closed).

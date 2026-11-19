# Sach Studio website

Next.js (React) site for Sach Studio with a built-in admin panel for case studies and blog posts. Design source: the Figma file "Suman X Sach Studio website".

- Public pages are built ahead of time, so they stay fast however much content you add.
- Text lives in Neon Postgres, images in Vercel Blob, admin login is Clerk (limited to your email).
- Publishing in the admin refreshes only the pages that changed, within seconds, with no rebuild.

## Run it on your computer

```powershell
npm install
npm run dev
```

Open http://localhost:3000. With no `DATABASE_URL` set, the site uses a built-in in-memory Postgres filled with the starting content, so the public site works straight away. It resets when you stop the server. (This only happens outside production; a production build with no `DATABASE_URL` stops with an error instead of showing an empty site.)

The admin needs Clerk (below). Without Clerk keys every `/admin` page and the upload endpoint refuse to open.

## Connect the services (one time)

1. Install the Vercel CLI and link the project: `npm i -g vercel`, then `vercel link`.
2. Add the integrations in your Vercel dashboard (Storage and Integrations): **Neon** (Postgres), **Blob**, and **Clerk**. Each one adds its keys to the project automatically.
3. Pull the keys: `vercel env pull .env.local --yes`.
4. Add the rest to `.env.local` and to the Vercel project settings:

| Name | What it is |
|---|---|
| `ADMIN_EMAILS` | Your email, or several separated by commas. Only these people can use `/admin`. |
| `NEXT_PUBLIC_CAL_LINK` | Your Cal.com booking link, for example `your-name/15min`. It fills the booking calendar. |
| `NEXT_PUBLIC_SITE_URL` | The live address, for example `https://sach.studio`. Used for the sitemap and search previews. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/admin/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/admin/sign-in` |

5. In the Clerk dashboard, turn off public sign-ups (or restrict sign-up to your email) so nobody else can create an account. The email list above is a second lock.
6. Create the tables and add the starting content:

```powershell
npm run db:push
npm run db:seed
```

`db:seed` can be run again safely; it updates by slug and never duplicates.

7. Deploy: `vercel deploy` for a preview, `vercel deploy --prod` for the live site. Then add your domain in the Vercel dashboard.
8. In Cal.com, set the booking confirmation redirect to `https://your-domain/thank-you`.

## Add a case study

1. Go to `/admin` and sign in.
2. **New case study.** Fill in the title (the page address fills itself in), category, images, and the story sections. Sections you leave empty are left out of the page.
3. A case study needs a **card image** and **card summary** to be published, and **About text** for its own page to exist (cards without it show on the Works page but have no "Case study" link).
4. **Save draft** to keep it private, **Preview** to see the page as visitors will, **Publish** to put it live.
5. **Unpublish** takes it off the site. **Delete** removes it for good after a confirmation.

Blog posts work the same way, with a Write / Preview tab for the text (Markdown: `##` heading, `-` bullet, `[text](https://link)`).

Content marked **Needs content** in the list is placeholder text from the first build. See `docs/placeholder-content.md` for what to replace.

## Images

- Uploads in the admin go to Vercel Blob (PNG, JPG, WebP, SVG or AVIF, up to 8 MB).
- The images that ship with the site are in `public/images/`. They were cropped from the Figma design at 1x, so export the originals from Figma at 2x and overwrite the files with the same names. `docs/assets-to-replace.md` lists each file.

## Page content that is not in the admin

Pricing, testimonials, FAQ, About text and the legal pages are code files: `src/content/home.ts`, `faqs.ts`, `about.ts`, `legal.ts`, `site.ts` (links, contact details). Edit the file and deploy. The LinkedIn, Instagram and Twitter / X links in `site.ts` currently point to the contact page until you add the real profile addresses.

## Tests and checks

```powershell
npm test                 # unit and component tests
npm run lint
npm run build            # production build
npx playwright test      # end-to-end tests (set PW_CHANNEL=msedge to use the installed Edge)
```

To run the end-to-end tests without any accounts, build with `ALLOW_LOCAL_DB=1`:

```powershell
$env:ALLOW_LOCAL_DB = "1"; npm run build; npx playwright test
```

The admin publish flow test runs when `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` (an allowed Clerk user) are set.

## Good to know

- Pages that are not built ahead of time (for example a case study published after the last deploy, or an address that does not exist) are rendered when first requested. A missing page shows the "page not found" screen and is marked `noindex`, but the HTTP status is 200 rather than 404; this is how Next.js behaves with its current caching model. Missing pages are never listed in the sitemap.
- Old Framer addresses (`/about-us`, `/project`, `/projects/...`, the `-copy` blog links) redirect to the new ones. The list is in `src/lib/redirects.ts`.
- Design tokens (colours, fonts) are in `src/app/globals.css`.

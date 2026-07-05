# KEKAL Studio — Review & Upgrade Notes

This is the reviewed and upgraded frontend: the customer-facing site
(`src/kekal`) and the admin console (`src/admin`), sharing one React +
Vite + TypeScript app. Below is exactly what was found and changed, and
what still needs attention before/after launch.

## How to run it

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # local dev
npm run build           # production build → dist/
npm run generate:sitemap  # writes public/sitemap.xml from live API data
```

**I could not run `npm install` / `npm run build` myself** — this
environment has no network access to the npm registry. Every file has
been checked by hand and by static analysis (import-path resolution,
CSS-module class cross-referencing), but please run a real build and
click through the site before deploying.

---

## Breaking bugs fixed

These would have caused real problems in production, not just style nits:

1. **`ContactSection.tsx` imported modules that don't exist**
   (`database-services/contactInfoService`, `.../pageSectionService`).
   The rest of the app had already moved to the `useContactInfoByKey` /
   `useSectionByPageAndName` hooks; this one file was never updated and
   would fail to compile. Rewritten on the same hooks as every other page.

2. **`Seo.tsx` read the wrong field names.** It looked for
   `meta_title` / `meta_description` / `social_image` (snake_case), but
   the API and the admin "Pages & SEO" screen use `metaTitle` /
   `metaDescription` / `socialImage` (camelCase). Every page's admin-managed
   SEO data was silently ignored and titles/descriptions always fell back
   to hardcoded defaults. Fixed, and **`<Seo />` is now actually mounted
   on every page** — previously the component existed but was never
   imported anywhere, so no page had dynamic `<title>`, meta description,
   canonical tag, or Open Graph/Twitter tags at all.

3. **Footer/site logo was a hardcoded local file
   (`src/assets/logo.jpeg`)** that isn't included in the project's data —
   this file did not exist, so it would have been a broken build/broken
   image. The brand already stores its logo in Brand Identity
   (`useBrandIdentityByKey("logo")`, pointing at Cloudinary); the footer
   now reads it from there like every other brand asset, with a text
   fallback if it's ever unset.

4. **No 404 / catch-all route.** A bad or since-removed product/collection/
   event slug, or any typo'd URL, rendered a blank page. Added a real
   `NotFoundPage` and a `path: "*"` route, plus it's reused whenever a
   detail page's slug doesn't resolve.

5. **Contact form did nothing.** It was a plain `<form>` with no
   `onSubmit`, so clicking "Send" just reloaded the page. There is no
   message-submission endpoint in the API, so rather than fake success I
   wired it to compose a `mailto:` to the address already stored in
   Contact Info, with real validation and a status message. If/when a
   `/contact` POST endpoint exists, swap the `mailto:` for a fetch call.

6. **Homepage hero buttons were hardcoded** (`"Explore Collection"` /
   `"Our Story"`) even though the exact same copy already lives in the
   `page-sections` table for `page-home` → `hero`. `Hero` now takes
   `buttonLabels` from that section, falling back to the old copy only if
   the section has none.

7. **About page's quote used the wrong data field.** `designer-profile`
   has a dedicated `quote_author` key, but the page passed `designerName`
   into `QuoteSection` instead. Fixed (harmless today since both happen to
   be the same person, but wrong if a testimonial-style quote is ever used).

## Decoupled from `database-types`

Every customer-facing component previously imported a shared type from a
top-level `database-types/` folder (e.g. `import type { Product } from
"../database-types/product"`). That folder has been deleted; every
component now declares its own minimal prop interface with only the
fields it actually uses. This means:

- Components are self-contained and can be reused/tested without pulling
  in a global schema.
- A few latent type mismatches went away for free — e.g. `event.ts`
  typed `category` as a closed union (`"exhibition" | "bazaar" | ...`)
  but the real seed data uses arbitrary category names like `"cat1"`;
  components now just take `category: string`.

Two genuinely duplicate/dead files were also removed rather than ported:
`useAuth.ts` (an unused duplicate of `AuthContext`'s `useAuthContext` —
nothing imported it) and the entire `database-types` folder.

## SEO

- Fixed `Seo.tsx` and mounted it on every route (see above).
- Added `JSON-LD` structured data per page type: `Organization` (home),
  `AboutPage`/`Person` (about), `CollectionPage` (collections + detail),
  `Product` (product detail — see note on `offers` below), `Event`
  (events + upcoming events).
- Added `robots.txt` (disallows `/admin`, points at the sitemap),
  `llms.txt` (plain-language site summary for AI browsing agents), and
  `scripts/generate-sitemap.mjs`, which builds `sitemap.xml` from live
  API data instead of a hand-maintained static list.
- `NotFoundPage` sets `noindex` so 404s never get indexed.
- **Note on `Product` JSON-LD**: there is no price field anywhere in the
  product data model. `offers` is included with just `availability`
  (in/out of stock) rather than inventing a price — if online purchase or
  pricing is ever added, that's the field to fill in.
- This is still a client-rendered SPA (no server-side rendering), so meta
  tags are set after JS runs. Most crawlers handle this fine today, but if
  SEO ever underperforms, moving to a framework with SSR/SSG (Next.js,
  Remix, Astro islands, etc.) or pre-rendering at build time would be the
  next lever to pull.

## Performance

- Google Fonts moved from a CSS `@import` (blocks the CSSOM behind a
  round trip) to a real `<link rel="preconnect">` + `<link
  rel="stylesheet">` pair in `index.html`, loaded in parallel with the
  app bundle. Added `preconnect` for Cloudinary and Unsplash too.
- Every route is now `React.lazy`-loaded (`src/routes/index.tsx`), so the
  admin console's bundle is never downloaded by a storefront visitor and
  vice versa.
- Added `src/kekal/utils/image.ts` (`optimizeImageUrl`) and used it on
  every Cloudinary-hosted image across the storefront, appending
  `q_auto,f_auto` (+ a width hint) so Cloudinary serves right-sized,
  modern-format images. This utility already existed for the admin
  uploader but was never used on the public site.
- `loading="eager" fetchPriority="high"` on the one hero/LCP image per
  page; `loading="lazy" decoding="async"` everywhere else.
- Added a Vite `manualChunks` split for React/React-DOM/React Router.
- Added a top-level `ErrorBoundary` so a single bad API response can't
  blank the whole page.

## Accessibility

- Every icon-only button (menu toggle, close buttons, gallery prev/next,
  remove-image, etc.) now has an `aria-label`.
- Added a skip-to-content link, landmark `<nav aria-label>`s, and a
  focus-visible outline in `global.css`.
- Mobile menu and product-image lightbox: focus moves in on open, `Esc`
  closes them, and they're marked as dialogs (`role="dialog"
  aria-modal`).
- The contact form's inputs previously relied on `placeholder` text
  alone; every field now has a real (visually hidden where appropriate)
  `<label htmlFor>`.
- Carousels/sliders (announcement bar, upcoming events, image slider,
  product gallery autoplay) now check `prefers-reduced-motion` before
  animating.
- Internal navigation (`Header`, `Footer`, `DesignerSection`,
  `ContactCTASection`) uses React Router's `<Link>`/`<NavLink>` instead
  of `<a href>`, so it's a client-side transition instead of a full page
  reload — better for both perceived performance and back/forward state.

**Known remaining gap, admin side:** most of the admin CRUD forms
(Collections/Products/Events/Upcoming Events pages) use visual
`<label>`s that aren't programmatically associated with their `<input>`
via `htmlFor`/`id`. I fixed this pattern in `LoginPage`, `NavigationPage`,
and the shared upload/rich-text components, but given the size of the
remaining CRUD pages (~500–900 lines each), a full pass wasn't completed
here. It's a mechanical fix (add matching `id`/`htmlFor` pairs) and worth
doing as a follow-up since the admin is a real day-to-day tool for
non-technical staff.

## Mobile-first / responsive

The existing `tokens.css` fluid-spacing/fluid-type system (`clamp()`
everywhere) was already solid and mobile-first, so it's preserved as-is.
Fixes here were about content, not layout:

- Collection/product descriptions can contain literal newlines (visible
  in the seed data); added `white-space: pre-line` so they render instead
  of collapsing to one line.
- Empty states added to every list/grid (collections, products, event
  archive, community events) instead of rendering nothing when a
  category has no data yet.

## No hardcoded data

Beyond the logo and hero-button fixes above, every other piece of
customer-facing copy was already correctly sourced from the API — this
was a genuinely thorough existing implementation. The main gaps were the
two hardcoded items called out above, plus the config values noted below.

## Config / environment

`client.ts`, `cloudinary.ts`, and the public `api.ts` had the backend
URL, Cloudinary cloud name, and upload preset hardcoded as literals.
Moved to `import.meta.env.VITE_*` (see `.env.example`), with the current
values kept as fallback defaults so nothing breaks if the env file is
missing — but every real deployment should set these explicitly per
environment (staging vs. production).

## Assets

No favicon/app-icon binary was provided in the source files handed over
for this review. `index.html` and `site.webmanifest` reference
`/public/favicon.jpg` and manifest icons that need to be supplied before
this goes live — see `public/README_ASSETS.txt`.

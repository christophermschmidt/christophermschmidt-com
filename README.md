# christophermschmidt.com

Source for [christophermschmidt.com](https://christophermschmidt.com) — a Next.js site (App Router, static export) built for Cloudflare Pages.

## Layout

- `website/` — the Next.js app. Cloudflare Pages should build with **root directory: `website`**.
- `DARF/` — source content for the [Data and AI Readiness Framework](https://christophermschmidt.com/darf): `CAPABILITIES.md` plus one markdown file per capability in `capabilities/`. Rendered live by `website/lib/darf.ts`.
- `articles/` — published Real Time Dispatch essays, rendered by `website/lib/articles.ts`.

DARF and articles content live as siblings to `website/` rather than inside it so the same content directories can be edited independently of the site code.

## Build

```
cd website
npm install
npm run build       # static export to website/out
```

`npm run build` also runs a post-build deployment-header step. Cloudflare Pages
provides `CF_PAGES_BRANCH`; builds whose branch differs from the production
branch receive an `X-Robots-Tag: noindex, nofollow, noarchive` header through
both the ordinary static export (`website/out/_headers`) and the configured
Cloudflare adapter output (`website/.vercel/output/static/_headers`). The
production branch remains indexable. The production branch defaults to `master`,
matching the verified Pages project configuration, and can be set explicitly
with `SITE_PRODUCTION_BRANCH` if that configuration changes.

This indexing header is not access control. Private evidence, paid artifacts,
and review notes must remain outside the deployed repository and build output.

## The Data and AI Readiness Framework (DARF)

This repository is the canonical, current source for DARF, superseding any earlier content published under the "Analytics Readiness Framework (ARF)" name on datasagesolutions.com.

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

## The Data and AI Readiness Framework (DARF)

This repository is the canonical, current source for DARF, superseding any earlier content published under the "Analytics Readiness Framework (ARF)" name on datasagesolutions.com.

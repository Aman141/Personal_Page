# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on :3000 (Turbopack)
npm run build    # production build — also the only type-check, since tsconfig is noEmit
npm run lint     # next lint (eslint-config-next flat config)
npm start        # serve the production build
```

There is no test framework configured. `npm run build` is the correctness gate: TypeScript is `strict` but `noEmit`, so type errors surface only at build time (or via the editor's TS server).

Adding a new `@utility` (or other CSS-level Tailwind config) to `globals.css` does not always reach a running `next dev` via HMR — the class lands in the markup with no rule behind it, which looks like a broken style rather than a stale build. Restart the dev server after editing Tailwind's CSS config.

**Do not run `npm run build` while `npm run dev` is running.** Both write to `.next`, and Turbopack's dev artifacts and the production build clobber each other — the symptom is every route except `/` returning 500 with `Cannot find module '../../chunks/ssr/[turbopack]_runtime.js'`. Stop the dev server first. (Editing `next.config.ts` restarts `next dev`, which clears it up too.)

Verifying a build in a throwaway copy of the tree **no longer works** if that copy symlinks `node_modules`: since Next 16, Turbopack is the default build bundler and rejects it with `Symlink [project]/node_modules is invalid, it points out of the filesystem root`. Stop the dev server and build in place.

## Architecture

Next.js 16 App Router + React 19 + Tailwind CSS 4, TypeScript. Deployed on Vercel. Path alias `@/*` → `./src/*`.

**Component layout — two directories, and the split is intentional:**

- `src/components/` — shared across routes (`ContentCard`, `Header`, `Footer`, `DarkModeToggle`, `AnalyticsWrapper`). PascalCase filenames, imported as `@/components/...`.
- `src/app/components/` — sections used only by the home page (`intro.tsx`, `popular_contents.tsx`). snake_case filenames, imported relatively from `src/app/page.tsx`.

Shared UI goes in `src/components/`; route-local sections live next to their route.

**`ContentCard` is the only card component** — it backs the home sliders, `/projects` and `/blog`. Don't add a second one; extend it. Two things to know before editing:

- The whole card is clickable via a **stretched-link overlay** (`absolute inset-0`), not a wrapping anchor, so the optional `secondary` link can sit above it with `z-10`. A wrapping anchor makes that impossible — nested `<a>` is invalid HTML.
- The `image` prop requires an explicit `sizes`. The same component renders at ~371px in a slider and ~694px in the blog list, so one hardcoded value would mis-fetch on one of them.

**Layout composition:** `src/app/layout.tsx` owns the single `<main>` element, wrapping `ThemeProvider` → `Header` → `<main>` → `Footer`. **Page components must not render their own `<main>`** — that would nest two, which is invalid HTML and confuses screen readers. Use a `<div>` as the page root. The footer's email and social URLs are props passed from `layout.tsx`, which is the one place personal contact info lives.

### Theming

There is **no `tailwind.config.ts`** — Tailwind 4 no longer auto-detects JS config files, so all configuration lives in `src/app/globals.css`:

- `@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` utilities respond to a `.dark` class on `<html>` instead of the OS `prefers-color-scheme` default. Without this line every `dark:*` class in the codebase silently ignores the toggle.
- `@theme inline` maps `--font-sans` / `--font-mono` onto the `--font-geist-*` variables that `layout.tsx` injects, which is what makes the Geist fonts actually apply. Loading them in `layout.tsx` alone is not enough.
- `html` / `html.dark` define `--background` and `--foreground`, consumed by `body`.

The theme is resolved in three steps, and the order matters:

1. A blocking inline `<script>` at the top of `<body>` in `layout.tsx` reads `localStorage.theme` (falling back to `prefers-color-scheme`) and applies `.dark` **before first paint**. Since every `dark:` utility now depends on that class, deferring this to an effect would flash a light page at dark-mode visitors. `<html>` carries `suppressHydrationWarning` because the script mutates its className pre-hydration.
2. `DarkModeToggle` renders both labels and lets CSS (`dark:hidden` / `hidden dark:inline`) choose, so the button is correct on first paint without waiting for any state to sync.
3. `ThemeContext` therefore holds **no state at all** — it exposes only `toggleTheme`, which reads the current class off `<html>` at click time. The `dark` class is the single source of truth. It previously mirrored that class into `useState` via an effect; nothing ever read the value, and `react-hooks/set-state-in-effect` rightly flags the pattern. Don't reintroduce it unless something genuinely needs to render off the theme value — and if it does, reach for `useSyncExternalStore` rather than an effect.

If you add a system-preference CSS media query here, make sure it can't override `html.dark` — step 1 already handles the system default, so a media query is redundant and will fight the toggle.

### Linting

`eslint.config.mjs` spreads `eslint-config-next`'s flat configs in **directly**. Do not route them through `@eslint/eslintrc`'s `FlatCompat` (which is what `next lint` used to do): since v16 the package ships native flat config, and the compat layer throws a circular-reference error while validating the schema. `@eslint/eslintrc` is no longer a dependency.

The `ignores` block is load-bearing — `next lint` used to supply it implicitly, and without it `eslint .` walks `.next/` and reports thousands of errors from generated code. Keep `eslint-config-next` on the same version as `next`.

### Data: Medium posts

`src/lib/medium.ts` is the only external data source. `getMediumPosts()` reads Medium's RSS feed **on the server** with `next: { revalidate: 3600 }`, parsing it with `fast-xml-parser`.

- **Server-side by design.** An earlier version proxied through `api.rss2json.com` purely to dodge CORS, which cost indexability (posts invisible to crawlers), resilience (a third-party outage blanked the section) and time-to-paint. Don't reintroduce a client fetch.
- The parser sets `isArray` for `item` and `category`: a single element otherwise parses to a bare value instead of an array.
- The feed has **no `<description>`** — summaries come from `content:encoded`, which is full post HTML, with tags stripped and entities decoded.
- `safeThumbnail` drops thumbnails not on `*.medium.com` and Medium's `/_/stat` tracking pixel. The host check exists because `next/image` throws on hosts absent from `images.remotePatterns` in `next.config.ts` — **widen both together, never just one.**
- Failure returns `{ posts: [], error }` rather than throwing, so a feed outage degrades one section instead of failing a page render or a production build.
- `/blog` and `BlogList` are server components. `popular_contents.tsx` must stay `"use client"` (it owns the sliders), so `src/app/page.tsx` fetches and passes posts down as props — add data there, not inside the client component.

### Project content

`src/data/projects.ts` is the single source for the home slider, `/projects`, the `/projects/[slug]` detail pages, and the sitemap. Two rules are written into that file and worth respecting:

1. **Only quote a metric the linked source actually reports.**
2. **If a metric is optimistic, say why in `limitations`.** Three of the five projects have known measurement problems (epoch-level rather than subject-level splits, in-sample error figures). The detail pages publish those caveats in a section as prominent as Results — deliberately, since a reviewer who opens the notebook will find them anyway.

`detail` is a required field, so a project cannot ship a page thinner than its own card.

Everything else is hardcoded JSX: the experience/skills/education content in `src/app/about/page.tsx`. There is no CMS.

### Internal links

Use `next/link` for internal navigation, never a raw `<a href="/...">` — an anchor triggers a full page reload and drops the client-side router. ESLint's `no-html-link-for-pages` catches most cases but has missed some in this repo, so don't rely on it alone.

### Contact form

`/contact` renders a form **only when `RESEND_API_KEY` is set**, checked server-side in `src/app/contact/page.tsx`. Without it the page shows a direct-email panel. This is load-bearing, not defensive styling: a visible form that cannot send silently loses real messages. `src/app/api/contact/route.ts` re-checks the same variable, because build-time and runtime config can differ.

- The page is statically generated, so **the key is read at build time** — adding it to Vercel needs a redeploy to take effect.
- Resend is called with plain `fetch`, not their SDK, to avoid a dependency. `reply_to` is the visitor's address so replying reaches them.
- The hidden `company` field is a honeypot. When tripped the handler returns `200`, so a bot can't distinguish rejection from success — don't "fix" this to an error status.
- `CopyEmailButton` must keep its `stopPropagation`: the row behind it is a `mailto:` link, so without it a copy click also opens the mail client.

### Analytics

`AnalyticsWrapper` is a server component that renders `@vercel/analytics` only when `NODE_ENV === "production"` and `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "false"`, so local traffic never reaches production stats. The flag is read at build time. Note that `<Analytics />` injects its script after hydration, so it won't appear in server-rendered HTML — to confirm it's bundled, grep `.next/static/chunks/app/` for `_vercel/insights`.

## Current state of the routes

`/`, `/about`, and `/blog` are built out. `/projects` and `/contact` are "coming soon" placeholders. The featured-project cards therefore all link to `/projects` rather than per-project detail routes; when real detail pages exist, give each entry in the `projects` array its own `link`.

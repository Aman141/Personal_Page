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

Next.js 15 App Router + React 19 + Tailwind CSS 4, TypeScript. Deployed on Vercel. Path alias `@/*` → `./src/*`.

**Component layout — two directories, and the split is intentional:**

- `src/components/` — chrome shared across every route (`Header`, `Footer`, `DarkModeToggle`, `AnalyticsWrapper`). PascalCase filenames, imported as `@/components/...`.
- `src/app/components/` — sections used only by the home page (`intro.tsx`, `popular_contents.tsx`). snake_case filenames, imported relatively from `src/app/page.tsx`.

Shared UI goes in `src/components/`; route-local sections live next to their route.

**Layout composition:** `src/app/layout.tsx` owns the single `<main>` element, wrapping `ThemeProvider` → `Header` → `<main>` → `Footer`. **Page components must not render their own `<main>`** — that would nest two, which is invalid HTML and confuses screen readers. Use a `<div>` as the page root. The footer's email and social URLs are props passed from `layout.tsx`, which is the one place personal contact info lives.

### Theming

There is **no `tailwind.config.ts`** — Tailwind 4 no longer auto-detects JS config files, so all configuration lives in `src/app/globals.css`:

- `@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` utilities respond to a `.dark` class on `<html>` instead of the OS `prefers-color-scheme` default. Without this line every `dark:*` class in the codebase silently ignores the toggle.
- `@theme inline` maps `--font-sans` / `--font-mono` onto the `--font-geist-*` variables that `layout.tsx` injects, which is what makes the Geist fonts actually apply. Loading them in `layout.tsx` alone is not enough.
- `html` / `html.dark` define `--background` and `--foreground`, consumed by `body`.

The theme is resolved in three steps, and the order matters:

1. A blocking inline `<script>` at the top of `<body>` in `layout.tsx` reads `localStorage.theme` (falling back to `prefers-color-scheme`) and applies `.dark` **before first paint**. Since every `dark:` utility now depends on that class, deferring this to an effect would flash a light page at dark-mode visitors. `<html>` carries `suppressHydrationWarning` because the script mutates its className pre-hydration.
2. `ThemeContext` reads the resolved value back off the DOM on mount rather than re-deriving it, so the two can't disagree.
3. `DarkModeToggle` renders both labels and lets CSS (`dark:hidden` / `hidden dark:inline`) choose, so the button is correct on first paint without waiting for state to sync.

If you add a system-preference CSS media query here, make sure it can't override `html.dark` — step 1 already handles the system default, so a media query is redundant and will fight the toggle.

### Data: Medium posts

`src/hooks/useMediumPosts.ts` is the only external data source. It pulls the Medium RSS feed through the public `api.rss2json.com` proxy (Medium has no REST API) and maps items to `BlogPost`. Consequences:

- Fetching happens client-side in a `useEffect`, so every consumer must be a client component — that's why `src/app/blog/page.tsx` and `popular_contents.tsx` are `"use client"`.
- `MEDIUM_USERNAME` in the hook is the single source of truth; call `useMediumPosts()` with no argument.
- `safeThumbnail` drops any thumbnail not on `*.medium.com`, because `next/image` throws on hosts absent from `images.remotePatterns` in `next.config.ts`. Widen both together, never just one. (In practice this feed returns empty thumbnails, so that path is usually dead.)
- No caching or revalidation, and the proxy is unauthenticated and rate-limited. A feed failure is scoped to the "Featured Blog" section on the home page — keep it that way rather than early-returning from `PopularContents`, which would take the projects section down with it.

Everything else is hardcoded JSX: the `projects` array in `popular_contents.tsx` and the experience/skills/education content in `src/app/about/page.tsx`. There is no CMS or data layer.

### Analytics

`AnalyticsWrapper` is a server component that renders `@vercel/analytics` only when `NODE_ENV === "production"` and `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "false"`, so local traffic never reaches production stats. The flag is read at build time. Note that `<Analytics />` injects its script after hydration, so it won't appear in server-rendered HTML — to confirm it's bundled, grep `.next/static/chunks/app/` for `_vercel/insights`.

## Current state of the routes

`/`, `/about`, and `/blog` are built out. `/projects` and `/contact` are "coming soon" placeholders. The featured-project cards therefore all link to `/projects` rather than per-project detail routes; when real detail pages exist, give each entry in the `projects` array its own `link`.

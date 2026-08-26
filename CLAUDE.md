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

- `src/components/` — shared across routes (`ProjectCard`, `ProjectRow`, `PostRow`, `Header`, `Footer`, `DarkModeToggle`, `AnalyticsWrapper`). PascalCase filenames, imported as `@/components/...`.
- `src/app/components/` — sections used only by the home page (`hero.tsx`, `sonar_canvas.tsx`, `now_strip.tsx`, `featured_work.tsx`, `writing_preview.tsx`). snake_case filenames, imported relatively from `src/app/page.tsx`.

Shared UI goes in `src/components/`; route-local sections live next to their route. Route-local components outside `src/app/components/` are PascalCase (`WorkIndex.tsx`, `BlogList.tsx`, `ContactForm.tsx`, `RetrievalDemo.tsx`).

**There are three list primitives, one per shape.** The old single `ContentCard` was removed with the redesign — the three shapes no longer share an anatomy, and one component with three variants was worse than three components. Don't add a fourth; if a new surface needs one of these shapes, reuse it.

- `ProjectCard` — home featured grid. Reads `short`, not `description`: the long copy wraps to five or six lines at one-third width and pushes the "Open" affordance out of line with its neighbours.
- `ProjectRow` — the `/projects` index row. Carries two destinations, so the row-wide target is a **stretched-link overlay** (`after:absolute after:inset-0`) on the title rather than a wrapping anchor, and the "Source" link sits above it with `relative z-10`. A wrapping anchor makes that impossible — nested `<a>` is invalid HTML.
- `PostRow` — shared by `/blog` and the home writing section, with `showExcerpt` as the only difference. Its grid collapses to one column below ~170px of track space, which is what makes the same component work in the home page's narrower column without a second layout.

The design lists posts as text rows with **no thumbnails**, so nothing renders `post.thumbnail` any more. `safeThumbnail` and `images.remotePatterns` are still in place — the field is the only thing that would need re-plumbing if images come back.

**Layout composition:** `src/app/layout.tsx` owns the single `<main>` element, wrapping `ThemeProvider` → `Header` → `<main>` → `Footer`. **Page components must not render their own `<main>`** — that would nest two, which is invalid HTML and confuses screen readers. Use a `<div>` as the page root. The footer's email and social URLs are props passed from `layout.tsx`, which is the one place personal contact info lives.

### Theming

There is **no `tailwind.config.ts`** — Tailwind 4 no longer auto-detects JS config files, so all configuration lives in `src/app/globals.css`:

- `@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` utilities respond to a `.dark` class on `<html>` instead of the OS `prefers-color-scheme` default. Without this line every `dark:*` class in the codebase silently ignores the toggle.
- `@theme inline` maps `--font-sans` / `--font-mono` onto the `--font-geist-*` variables that `layout.tsx` injects, which is what makes the Geist fonts actually apply. Loading them in `layout.tsx` alone is not enough. **`inline` is also what makes the toggle work at all**: it emits `var(--surface)` into each utility instead of the resolved value, so `.dark` can re-point the token at runtime. Drop `inline` and every colour freezes at build time.
- Two `@utility` rules carry the layout: `shell` (the 1280px page gutter every section holds its content with) and `mono-label` (the recurring monospace uppercase eyebrow).

**The palette has two families, and the split is the whole design.**

- **Fixed** — `--abyss`, `--deep`, `--teal`, `--accent`, and the gradients. Text on them is hardcoded `text-white` / `text-white/70`. **Never give a fixed token a `.dark` override** — `--surface` in dark mode is deliberately close to `--deep`, so overriding `--deep` too would collapse the boundary between a dark band and the section under it.
- **Adaptive** — `--surface`, `--surface-subtle`, `--ink*`, `--line*`, `--action`. These are the sections the design draws on white, and they flip under `.dark`.

**Only five bands are fixed dark**, and they are all feature bands rather than chrome: the home hero, the strip under it, each project page's header, the contact page's header, and the RAGdemo demo panel. Everything else — including the site header, the footer and the 404 — is adaptive.

That split was not the original one. The site header, footer and 404 were fixed dark too, which meant light mode reached almost none of what a visitor actually saw: on the home page the header, the 640px hero and the strip stacked to roughly 840px of unchanging dark before the first adaptive section, so on a laptop the entire first screen was identical in both themes, and the 404 had no adaptive band at all. Chrome appears on every route, so it has to follow the theme; feature bands are a deliberate accent and do not. If you add a new band, ask which of those two it is.

To check this after a change: grep the prerendered HTML in `.next/server/app/` for the background class on each `<header>`, `<section>` and `<footer>`. Bands are the only thing that matters here — a `bg-deep` button on an adaptive surface is fine and expected.

`--action` is **not** the accent. `#82CFFF` on white is about 1.5:1 and unreadable, so adaptive sections get a darker blue and only the fixed dark surfaces get the light accent. The same applies to filled controls: the Contact pill and the 404 button are `bg-deep text-white` in light mode and only become `bg-accent text-deep` under `dark:`.

The design canvas targets Aeonik / Aeonik Fono from the Evologics design system. Neither is licensed here, so Geist Sans and Geist Mono stand in — both were already loaded, and the design leans on 300-weight text that Geist carries.

The theme is resolved in three steps, and the order matters:

1. A blocking inline `<script>` at the top of `<body>` in `layout.tsx` reads `localStorage.theme` (falling back to `prefers-color-scheme`) and applies `.dark` **before first paint**. Since every `dark:` utility now depends on that class, deferring this to an effect would flash a light page at dark-mode visitors. `<html>` carries `suppressHydrationWarning` because the script mutates its className pre-hydration.
2. `DarkModeToggle` renders both icons and lets CSS (`dark:hidden` / `hidden dark:block`) choose, so the button is correct on first paint without waiting for any state to sync. It sits in the header, which is adaptive, so its own colours are ink tokens too.
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
- `/blog`, `BlogList` and `WritingPreview` are all server components. `src/app/page.tsx` fetches the feed and passes posts down as props, because `Hero` next to it must stay `"use client"` for the persona carousel — add data there, not inside a client component.

### Project content

`src/data/projects.ts` is the single source for the home slider, `/projects`, the `/projects/[slug]` detail pages, and the sitemap. Two rules are written into that file and worth respecting:

1. **Only quote a metric the linked source actually reports.**
2. **If a metric is optimistic, say why in `limitations`.** Three of the five projects have known measurement problems (epoch-level rather than subject-level splits, in-sample error figures). The detail pages publish those caveats in a section as prominent as Results — deliberately, since a reviewer who opens the notebook will find them anyway.

`detail` is a required field, so a project cannot ship a page thinner than its own card.

The redesign added four fields. `short` is the home-grid copy; `kind` and `domains` drive the label beside the project number and the filter chips on `/projects`; `detail.stats` is the three-cell strip under the project header. Two derived helpers replace stored values: `projectNumber(slug)` reads the "01"–"06" off array order, so reordering can't leave two entries sharing a number, and `featuredProjects` must stay at **exactly three** — the home heading counts them out loud ("Three projects worth ten minutes of your time"), and a fourth wraps the grid and makes the heading false. The `/projects` heading spells its own count from `projects.length`, so that one self-corrects.

**The detail page keeps its Limitations section even though the design canvas has none.** Dropping it to match the mockup would publish the headline figures without the caveats that qualify them, which is the thing rule 2 exists to prevent.

Everything else is hardcoded JSX: the experience/skills/education content in `src/app/about/page.tsx`. There is no CMS.

### Internal links

Use `next/link` for internal navigation, never a raw `<a href="/...">` — an anchor triggers a full page reload and drops the client-side router. ESLint's `no-html-link-for-pages` catches most cases but has missed some in this repo, so don't rely on it alone.

### Contact form

`/contact` renders a form **only when `RESEND_API_KEY` is set**, checked server-side in `src/app/contact/page.tsx`. Without it the page shows a direct-email panel. This is load-bearing, not defensive styling: a visible form that cannot send silently loses real messages. `src/app/api/contact/route.ts` re-checks the same variable, because build-time and runtime config can differ.

- The page is statically generated, so **the key is read at build time** — adding it to Vercel needs a redeploy to take effect.
- Resend is called with plain `fetch`, not their SDK, to avoid a dependency. `reply_to` is the visitor's address so replying reaches them.
- The hidden `company` field is a honeypot. When tripped the handler returns `200`, so a bot can't distinguish rejection from success — don't "fix" this to an error status.
- `CopyEmailButton` sits *beside* the `mailto:` link now rather than on top of it, so its `stopPropagation` is belt-and-braces rather than load-bearing. Keep it anyway — it is what stops a copy click also opening the mail client if the button is ever nested inside a link again.
- **The page is two-tone: a dark header, then the body on `--surface`.** The dark band stops at the header deliberately — every other route either opens dark and resolves to light or is light throughout, and a page that stayed dark to the footer would be the only one on the site that does. It also puts the form on an adaptive surface, where its fields use the ink tokens and follow the page theme instead of being three near-black layers deep.
- The form is the primary action and takes the wider column; the address sits in the rail beside it at body size. Three other layouts were built and compared before this one was chosen (`git log` on `src/app/contact/`), including one that gave the address display size next to the form — two calls to action at the same weight, which is the thing this layout exists to avoid. Don't reintroduce that.
- `ContactForm`, `CopyEmailButton` and `EmailFallback` were briefly parameterised over a `tone` prop while those layouts were being compared. Only the adaptive path survived, so the prop is gone — recover it from history rather than re-deriving it if a dark panel ever needs one.
- `channels.ts` is the single list of ways to reach me, ordered by what to try first. `socialChannels` drops email for layouts that give the address its own slot, and `externalProps` is what keeps `mailto:` from opening in a new tab.

### Analytics

`AnalyticsWrapper` is a server component that renders `@vercel/analytics` only when `NODE_ENV === "production"` and `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "false"`, so local traffic never reaches production stats. The flag is read at build time. Note that `<Analytics />` injects its script after hydration, so it won't appear in server-rendered HTML — to confirm it's bundled, grep `.next/static/chunks/app/` for `_vercel/insights`.

## Home page

The hero is the only genuinely interactive section. Two things about it:

- **`Hero` is a client component** because it owns the persona carousel. The rotating copy sits inside a single `aria-live="polite"` region so a screen reader hears one update rather than three, and the headline and body carry `min-h` so the controls below don't jump a line when the copy swaps.
- **`SonarCanvas` is decorative** (`aria-hidden`) and self-throttling: it sizes its backing store by `devicePixelRatio`, paints a single static frame under `prefers-reduced-motion` (and re-checks when that preference changes mid-visit), and ties its `requestAnimationFrame` loop to an `IntersectionObserver` so it stops burning frames once scrolled past.

## Current state of the routes

All six routes are built out: `/`, `/projects`, `/projects/[slug]`, `/about`, `/blog` and `/contact`.

`/projects/ragdemo` additionally renders `RetrievalDemo`, a browser-only miniature of that project's pipeline over the six-chunk corpus in `src/data/retrieval-demo.ts`. It is keyed by slug (`DEMO_SLUG`) rather than a flag on the data, because it is a bespoke component rather than something any project could switch on. It scores by keyword prefix, **not** embeddings — the surrounding copy says so, and it should keep saying so. Its one behaviour worth preserving is the abstention: a query that matches nothing returns "no grounded answer" rather than inventing one.

The `/about` gradient panels are placeholders for photographs. To use real images, swap each for a `next/image` with an explicit `sizes` — the portrait renders at ~340px and the two squares at ~163px.

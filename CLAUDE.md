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
- `src/app/components/` — sections used only by the home page (`hero.tsx`, `sonar_canvas.tsx`, `featured_work.tsx`, `writing_preview.tsx`). snake_case filenames, imported relatively from `src/app/page.tsx`.

Shared UI goes in `src/components/`; route-local sections live next to their route. Route-local components outside `src/app/components/` are PascalCase (`WorkIndex.tsx`, `BlogList.tsx`, `ContactForm.tsx`, `RetrievalDemo.tsx`).

**There are three list primitives, one per shape.** The old single `ContentCard` was removed with the redesign — the three shapes no longer share an anatomy, and one component with three variants was worse than three components. Don't add a fourth; if a new surface needs one of these shapes, reuse it.

- `ProjectCard` — home featured grid. Reads `short`, not `description`: the long copy wraps to five or six lines at one-third width and pushes the "Open" affordance out of line with its neighbours.
- `ProjectRow` — the `/projects` index row. Carries two destinations, so the row-wide target is a **stretched-link overlay** (`after:absolute after:inset-0`) on the title rather than a wrapping anchor, and the "Source" link sits above it with `relative z-10`. A wrapping anchor makes that impossible — nested `<a>` is invalid HTML.
- `PostRow` — shared by `/blog` and the home writing section, switched by a `detailed` flag. `detailed` deliberately mirrors `ProjectRow`'s anatomy (mono rail → title + summary + tag chips → right-hand action column, rule below, tint on hover) so the two index pages read as siblings; without it the row is the compact two-part preview the home page needs in its narrower column, and that variant is intentionally frozen. The rail is a **fixed** basis in both, and that is load-bearing: it was an auto-fit grid whose tracks used `auto` as their maximum, which both sizes to content and absorbs free space, so each row's rail came out as wide as that row's own title and excerpt made it and titles started at a different x on every row. `flex-wrap` preserves the container-driven collapse to a stacked layout — verified at a true 360–390px viewport, not a `--window-size` flag, which Chrome floors around 450px.

The design lists posts as text rows with **no thumbnails**, so nothing renders `post.thumbnail` any more. `safeThumbnail` and `images.remotePatterns` are still in place — the field is the only thing that would need re-plumbing if images come back.

**Layout composition:** `src/app/layout.tsx` owns the single `<main>` element, wrapping `ThemeProvider` → `Header` → `<main>` → `Footer`. **Page components must not render their own `<main>`** — that would nest two, which is invalid HTML and confuses screen readers. Use a `<div>` as the page root. The footer's email and social URLs are props passed from `layout.tsx`, which is the one place personal contact info lives.

### Theming

There is **no `tailwind.config.ts`** — Tailwind 4 no longer auto-detects JS config files, so all configuration lives in `src/app/globals.css`:

- `@custom-variant dark (&:where(.dark, .dark *))` makes `dark:` utilities respond to a `.dark` class on `<html>` instead of the OS `prefers-color-scheme` default. Without this line every `dark:*` class in the codebase silently ignores the toggle.
- `@theme inline` maps `--font-sans` / `--font-mono` onto the `--font-geist-*` variables that `layout.tsx` injects, which is what makes the Geist fonts actually apply. Loading them in `layout.tsx` alone is not enough. **`inline` is also what makes the toggle work at all**: it emits `var(--surface)` into each utility instead of the resolved value, so `.dark` can re-point the token at runtime. Drop `inline` and every colour freezes at build time.
- Two `@utility` rules carry the layout: `shell` (the 1280px page gutter every section holds its content with) and `mono-label` (the recurring monospace uppercase eyebrow).
- **A hand-written `@utility` cannot read a token declared in `@theme inline`.** `inline` substitutes theme values into the utilities Tailwind generates rather than emitting the custom property, so `--font-mono` and `--font-sans` do not exist at runtime. `mono-label` shipped as `font-family: var(--font-mono)`, which resolved to nothing and silently rendered every eyebrow on the site in Geist Sans; it now uses `var(--font-geist-mono)` — the variable `layout.tsx` actually injects. Reach for the `--font-geist-*` variables (or the `font-mono` utility) inside `@utility` blocks, never the `@theme inline` aliases.

**The palette has two families, and the split is the whole design.**

- **Fixed** — `--abyss`, `--deep`, `--teal`, `--accent`, and the gradients. Text on them is hardcoded `text-white` / `text-white/70`. **Never give a fixed token a `.dark` override** — `--surface` in dark mode is deliberately close to `--deep`, so overriding `--deep` too would collapse the boundary between a dark band and the section under it.
- **Adaptive** — `--surface`, `--surface-subtle`, `--ink*`, `--line*`, `--action`. These are the sections the design draws on white, and they flip under `.dark`.

**Only three bands are fixed dark**: each project page's header, the contact page's header, and the RAGdemo demo panel. Everything else is adaptive, including the site header, the footer, the 404, and the home hero.

The home hero has its own tokens because it is the one band that inverts rather than simply lightening. `--hero-wash` is the 105deg overlay — near-black opening to teal under `.dark`, accent blue clearing to white in light — and it stays dense at the left in both, because that is where the copy sits and where contrast has to hold. `--hero-bg` is the ground under the sonar canvas, `--sonar-stroke` is the trace colour, and `--hero-label` is the small accent label. That last one exists because `--action` only reaches 4.16:1 against the densest blue and those labels are 11–12px; it is `--action` two steps darker, and reverts to the ordinary accent under `.dark`.

**`--sonar-stroke` must stay a 6-digit hex.** `SonarCanvas` appends two hex digits of alpha to it, so an `rgb()` or a named colour yields an invalid `strokeStyle` and the waves silently do not draw. The component also re-reads the token on a `MutationObserver` watching `class` on `<html>`: a canvas keeps whatever was painted last, so without that a toggle leaves the sweep in the previous theme's colour — and under `prefers-reduced-motion`, where only one frame is ever painted, it would never correct itself.

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

The redesign added four fields. `short` is the home-grid copy; `kind` and `domains` drive the label beside the project number and the filter chips on `/projects`; `detail.stats` is the three-cell strip under the project header. Two derived helpers replace stored values: `projectNumber(slug)` reads the "01"–"06" off array order, so reordering can't leave two entries sharing a number, and `featuredProjects` must stay at **exactly three** — the home grid is `repeat(auto-fit, minmax(18.75rem, 1fr))` with a 20px gap in a 1232px shell, so a fourth column needs 1260px and a fourth project drops to a row of its own. The home heading used to count them out loud too, which was the stronger reason; that line is gone, the arithmetic is not. The `/projects` heading spells its own count from `projects.length`, so that one self-corrects.

**The detail page keeps its Limitations section even though the design canvas has none.** Dropping it to match the mockup would publish the headline figures without the caveats that qualify them, which is the thing rule 2 exists to prevent.

Everything else is hardcoded JSX: the experience/skills/education content in `src/app/about/page.tsx`. There is no CMS.

`/about`'s intro is the one place on the site that says what the work actually consists of: YOLO detection, cross-frame tracking, multi-view triangulation and frame anomaly detection; audio classification and signature matching. It leads with the capability rather than the employer's domain, matching the hero.

**Keep it short and keep it plain.** A draft of that intro ran to four paragraphs of balanced "on video it means X, on audio it means Y" prose and got sent back for reading as machine-written. The tells were the symmetry, the em-dashes, hedged clarifiers ("when the question is which one rather than what kind") and "actually" as emphasis. What shipped is 127 words with no em-dash in it. The last two paragraphs are the owner's own wording — trim them, don't rewrite them.

The "Away from the screen" paragraph is now the **only** personal material on the site, since the hero personas that used to carry it are gone.

The skills list is **grouped** (Vision / Audio / Modelling / Engineering) on the same 9rem rail the Experience and Education rows use, so the three lists on the page read as one system. It was a flat cloud of 19 that put `Computer Vision` beside `NumPy` and named nothing the intro claims. `Pandas`, `NumPy`, `Sklearn` and `Pytest` were dropped as implied by `Python`; `NLP` and `Data Analysis` as true of almost anyone. Every chip is backed by a project in `projects.ts`, by the experience list, or by the intro — a skills list is the cheapest place to overclaim and the easiest to probe in an interview.

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

**Say each thing once, and let the small label be the heading.** The page opened with three sections and a spec panel all restating the same two facts, and named Berlin three times before the fold. What is left is deliberate:

- The four-cell "now" strip is gone. Every cell of it repeated the hero panel above it (`Now`≈`Focus`, `Tools`≈`Methods`, `Based` verbatim, `Writing` duplicated the section below).
- `FeaturedWork` and `WritingPreview` have **no display heading**. They used to open "Three projects worth ten minutes of your time." and "Notes on the tools I use daily."; the mono eyebrow above each now carries the section on its own.
- Each persona is one sentence of body and two specs.

Together those took the first screen from 71 words to 37 and `<main>` from 189 to 139. Before adding copy here, check it is not already on screen — a home page competes with the visitor's patience, not with `/about`.

Consequences worth knowing:

- **Those eyebrows are `<h2>`, not `<p>`.** With the display lines gone they are the only thing between the hero's `<h1>` and the card and post titles' `<h3>`, so leaving them as paragraphs skips a heading level. They carry `m-0 font-normal` to undo what the element brings with it; the mono-label look is identical.
- `WritingPreview` is now structurally a copy of `FeaturedWork` — label row, then content full width. It was two columns, which existed to give the display heading a column of its own; without it the rail held two mono labels and ~430px of nothing. Widening the rows is why the list needs its own `border-b`: the compact `PostRow` rules itself on top only, which trails off at full width.
- The strip was also the boundary between the hero and the section below it, which nothing else drew — `--hero-bg` and `--surface` are both `#ffffff` in light mode, and the hero wash is transparent at its right end. `FeaturedWork` now carries a `border-t` for that, and it is not decorative.
- **Keep every persona at exactly two specs.** The panel has no min-height, so an uneven count resizes the card as the carousel steps.
- The headline and body `min-h` values are tuned to the longest copy in `personas` (two lines each, measured at 1440). Both personas currently render at exactly 139px / 59px, so the carousel does not move the page at all; a longer headline would reintroduce the jump these exist to prevent. Verify with every persona, not just the first.
- **The hero is two personas, both professional.** Photographer and Traveler were dropped; nothing else referenced them, but the hero was the only place the site presented itself as anything but a CV. `/about` still carries the personal material.
- The hero headline is **deliberately broader than the day job** — "detection and tracking in video and audio" rather than underwater acoustics, with the tooling split across a `Video` and an `Audio` spec. Note `site.description` (and so every page's meta description, the OG image and `/contact`) still says underwater acoustics, which is a real mismatch if the broader positioning is the intended one.

## Current state of the routes

All six routes are built out: `/`, `/projects`, `/projects/[slug]`, `/about`, `/blog` and `/contact`.

`/projects/ragdemo` additionally renders `RetrievalDemo`, a browser-only miniature of that project's pipeline over the six-chunk corpus in `src/data/retrieval-demo.ts`. It is keyed by slug (`DEMO_SLUG`) rather than a flag on the data, because it is a bespoke component rather than something any project could switch on. It scores by keyword prefix, **not** embeddings — the surrounding copy says so, and it should keep saying so. Its one behaviour worth preserving is the abstention: a query that matches nothing returns "no grounded answer" rather than inventing one.

The `/about` gradient panels are placeholders for photographs. To use real images, swap each for a `next/image` with an explicit `sizes` — the portrait renders at ~340px and the two squares at ~163px.

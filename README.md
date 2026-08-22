# Aman Kumar — Portfolio

Personal portfolio site, built with Next.js, React, and Tailwind CSS.

**Live:** [aman-kumar-ai.vercel.app](https://aman-kumar-ai.vercel.app)

## Features

- ⚡ Next.js 16 (App Router) and React 19
- 🎨 Tailwind CSS 4 — configured entirely in CSS, no JS config file
- 🌗 Light and dark mode, toggled by class and persisted to `localStorage`, applied before first paint so there is no flash
- 📝 Blog list generated from a Medium RSS feed **on the server**, with hourly revalidation, so posts are crawlable
- 🔍 SEO metadata per page, plus a build-time generated Open Graph image, `sitemap.xml`, and `robots.txt`
- 🖼️ Remote images optimised through `next/image`
- ✅ CI on every pull request: type check, lint, build

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Icons | `lucide-react` |
| Feed parsing | `fast-xml-parser` |
| Analytics | `@vercel/analytics` |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
```

### Scripts

| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build — type-checks as it goes (`tsconfig` is `noEmit`, so `npx tsc --noEmit` is the standalone check) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint .`) |

> **Don't run `npm run build` while `npm run dev` is running.** Both write to
> `.next` and will corrupt each other's output.

### Environment

Everything works with no configuration. Two optional variables:

| Variable | Effect |
|---|---|
| `RESEND_API_KEY` | Activates the `/contact` form. Without it the page shows a direct-email panel instead of a form, so a message is never silently dropped. See below. |
| `CONTACT_FROM_EMAIL` | Sender address for contact-form mail. Only needed once you have a domain verified with Resend. |
| `NEXT_PUBLIC_SITE_URL` | Overrides the production origin used for canonical URLs, Open Graph tags, and the sitemap. Set this if the domain changes. |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` | Set to `false` to disable analytics and speed insights in production. Both are always off in development. |

#### Activating the contact form

1. Create an account at [resend.com](https://resend.com) and generate an API key.
2. Add it to the Vercel project as `RESEND_API_KEY`.
3. **Redeploy.** `/contact` is statically generated, so the presence of the key
   is read at build time — adding the variable alone will not switch the form on.

Until then `/contact` renders a direct-email panel rather than a form. That is
deliberate: a form that posts into a void loses real messages.

The default sender is Resend's shared `onboarding@resend.dev`, which needs no
DNS setup but **only delivers to the address that owns the Resend account** —
fine here, since the form emails you. Verify a domain and set
`CONTACT_FROM_EMAIL` to change that.

## Directory Structure

```
my-portfolio/
├── .github/workflows/ci.yml   # type check, lint, build
├── public/                    # static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx         # root layout: metadata, theme, header/footer
│   │   ├── page.tsx           # home — fetches Medium posts, renders Intro
│   │   ├── globals.css        # Tailwind config + theme tokens
│   │   ├── opengraph-image.tsx# generated 1200×630 social preview
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── about/ blog/ projects/ contact/
│   │   └── components/        # home-page-only sections
│   ├── components/            # shared UI (ContentCard, Header, Footer, …)
│   ├── context/               # ThemeContext
│   ├── data/                  # projects.ts, site.ts — static content
│   └── lib/                   # medium.ts — server-side feed reader
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Customization

| To change | Edit |
|---|---|
| Name, role, tagline, social links | `src/data/site.ts` — feeds metadata, the OG image, the home tagline, and the footer |
| Availability pill on `/contact` | `availability` in `src/data/site.ts` — `null` hides it |
| Projects (home slider and `/projects`) | `src/data/projects.ts` — single source for both |
| Blog source | `MEDIUM_USERNAME` in `src/lib/medium.ts` |
| Bio, experience, education | `src/app/about/page.tsx` |
| Theme colours and Tailwind config | `src/app/globals.css` |
| Images and icons | `public/` |

### Notes for contributors

- **Tailwind 4 is configured in CSS, not JavaScript.** There is no
  `tailwind.config.ts`; the `dark:` variant, fonts, and custom utilities are
  declared in `src/app/globals.css`. Adding a JS config file will have no
  effect unless it is loaded with `@config`.
- **Page components must not render their own `<main>`** — `layout.tsx` owns
  the only one. Use a `<div>` as the page root.
- After adding a Tailwind `@utility` to `globals.css`, restart the dev server;
  HMR does not always pick it up.

## Deployment

Deployed on [Vercel](https://vercel.com/); pushes to `main` deploy
automatically. For any other Node host:

```bash
npm run build
npm start
```

## License

MIT

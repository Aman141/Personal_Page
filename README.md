# My Portfolio

A modern, minimal portfolio website built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com). This project is designed to showcase your work, skills, and contact information in a clean, responsive layout.

## Features

- ⚡ Built with Next.js 15 and React 19
- 🎨 Styled with Tailwind CSS 4
- 🖼️ Optimized images using Next.js Image component
- 🌗 Light and dark mode, toggleable and persisted to `localStorage`
- 📄 About, Blog, Projects, and Contact pages (easy to extend)
- 🚀 Ready to deploy on Vercel or any Node.js host

## Directory Structure

```
my-portfolio/
├── public/                  # Static assets (SVGs, images)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout (header/footer, theme, analytics)
│   │   ├── globals.css      # Global styles + Tailwind config
│   │   ├── about/page.tsx   # About page
│   │   ├── blog/page.tsx    # Blog page (Medium feed)
│   │   ├── contact/page.tsx # Contact page (template)
│   │   ├── projects/page.tsx# Projects page (template)
│   │   └── components/      # Home-page-only sections
│   ├── components/          # Shared UI (Header, Footer, …)
│   ├── context/             # ThemeContext
│   └── hooks/               # useMediumPosts
├── package.json             # Project metadata and scripts
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
└── ...
```

## Getting Started

### 1. Install dependencies

Using npm (recommended):

```bash
npm install
```

Or with yarn, pnpm, or bun:

```bash
yarn install
# or
pnpm install
# or
bun install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

### 3. Build for production

```bash
npm run build
npm start
```

## Customization

- **About page:** Edit `src/app/about/page.tsx` to update your bio.
- **Projects page:** Add your projects in `src/app/projects/page.tsx`.
- **Contact page:** Add your contact info or form in `src/app/contact/page.tsx`.
- **Blog:** Set your Medium handle via `MEDIUM_USERNAME` in `src/hooks/useMediumPosts.ts`.
- **Styling:** Edit `src/app/globals.css` — Tailwind 4 is configured in CSS, not a JS config file.
- **Assets:** Place images and SVGs in the `public/` directory.

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Deployment

Deploy easily on [Vercel](https://vercel.com/) (recommended) or any Node.js server:

1. Build the app: `npm run build`
2. Start: `npm start`

## Contributing

Feel free to fork this repo and submit pull requests!

## License

MIT

import type { Metadata } from "next";
import Link from "next/link";

// Also serves the notFound() call in /projects/[slug], so an unknown project
// slug lands here rather than on a framework default page.

export const metadata: Metadata = {
  title: "Page not found",
  // Nothing here is worth indexing, and a soft-404 in the index is worse than
  // no page at all.
  robots: { index: false, follow: true },
};

const destinations = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-surface pt-25 pb-24">
      <div className="shell">
        <p className="mono-label mb-6 text-[12px] tracking-[0.16em] text-action">
          Error 404
        </p>
        <h1 className="m-0 max-w-[20ch] text-[clamp(2rem,4.2vw,3.625rem)] leading-[1.05] font-light tracking-[-0.02em]">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-7 max-w-[52ch] text-lg leading-relaxed font-light text-ink-muted">
          The link may be out of date, or the page may have moved. Everything
          else is still where you left it.
        </p>

        <Link
          href="/"
          className="mt-11 inline-flex items-center gap-3 rounded-full bg-deep px-6.5 py-4 text-[15px] text-white transition-colors hover:bg-teal dark:bg-accent dark:text-deep dark:hover:bg-accent-soft"
        >
          Back to home
          <span className="font-mono" aria-hidden="true">
            →
          </span>
        </Link>

        <nav
          aria-label="Other pages"
          className="mono-label mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[12px] tracking-[0.08em]"
        >
          {destinations.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="border-b border-line pb-1 text-ink-muted transition-colors hover:border-action hover:text-action"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

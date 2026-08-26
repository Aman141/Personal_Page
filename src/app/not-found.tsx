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
    <section className="min-h-[70vh] bg-deep pt-25 pb-24">
      <div className="shell">
        <p className="mono-label mb-6 text-[12px] tracking-[0.16em] text-accent">
          Error 404
        </p>
        <h1 className="m-0 max-w-[20ch] text-[clamp(2rem,4.2vw,3.625rem)] leading-[1.05] font-light tracking-[-0.02em] text-white">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-7 max-w-[52ch] text-lg leading-relaxed font-light text-white/70">
          The link may be out of date, or the page may have moved. Everything
          else is still where you left it.
        </p>

        <Link
          href="/"
          className="mt-11 inline-flex items-center gap-3 rounded-full bg-accent px-6.5 py-4 text-[15px] text-deep transition-colors hover:bg-accent-soft"
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
              className="border-b border-white/20 pb-1 text-white/60 transition-colors hover:border-accent hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
        404
      </p>

      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400">
        The link may be out of date, or the page may have moved. Here is
        everything else.
      </p>

      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to home
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <nav
        aria-label="Other pages"
        className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {destinations.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm text-gray-500 transition-colors hover:text-purple-600 hover:underline dark:text-gray-400 dark:hover:text-purple-400"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

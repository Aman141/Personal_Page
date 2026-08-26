"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();

  // A project detail page is still "Projects" as far as the nav is concerned.
  // Exact matching everywhere else, or "/" would light up on every route.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // Adaptive, not fixed dark. The header appears on every route, so leaving
    // it on `--deep` meant light mode changed nothing above the fold.
    // Translucent over the home page's dark hero is the ordinary glass effect
    // and reads fine in both themes.
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-lg">
      <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-4">
        <Link
          href="/"
          className="mono-label text-[13px] tracking-[0.1em] text-ink transition-colors hover:text-action"
        >
          Aman Kumar<span className="text-action">.</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <nav
            aria-label="Main"
            className="mono-label flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] tracking-[0.08em]"
          >
            {NAV.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b pb-0.5 transition-colors ${
                    active
                      ? "border-action text-action"
                      : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            {/* Solid `--deep` in light mode; the accent only carries a pill
                once the surface behind it is dark. #82CFFF on white is too
                close in value to read as a filled button. */}
            <Link
              href="/contact"
              className="mono-label rounded-full bg-deep px-4.5 py-2.5 text-[12px] tracking-[0.08em] text-white transition-colors hover:bg-teal dark:bg-accent dark:text-deep dark:hover:bg-accent-soft"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

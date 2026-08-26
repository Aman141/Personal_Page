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
    <header className="sticky top-0 z-40 border-b border-white/12 bg-deep/80 backdrop-blur-lg">
      <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-4">
        <Link
          href="/"
          className="mono-label text-[13px] tracking-[0.1em] text-white transition-colors hover:text-accent"
        >
          Aman Kumar<span className="text-accent">.</span>
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
                      ? "border-accent text-accent"
                      : "border-transparent text-white/65 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href="/contact"
              className="mono-label rounded-full bg-accent px-4.5 py-2.5 text-[12px] tracking-[0.08em] text-deep transition-colors hover:bg-accent-soft"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

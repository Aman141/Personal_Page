"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
// import DarkModeToggle from "./DarkModeToggle"; // Uncomment if you have this component

export default function Header() {
  return (
    <>
      <header className="p-4 py-10 sm:p-12 mx-4 sm:mx-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Aman Kumar
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-3 text-sm">
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
          </nav>
          <DarkModeToggle />
        </div>
      </header>
      <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>
    </>
  );
}

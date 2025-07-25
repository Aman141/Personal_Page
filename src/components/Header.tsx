"use client";

import Link from "next/link";
// import DarkModeToggle from "./DarkModeToggle"; // Uncomment if you have this component

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          My Portfolio
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
      {/* <DarkModeToggle /> */}
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-500">
        🌓
      </div>
    </header>
  );
}

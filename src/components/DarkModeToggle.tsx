"use client";

import { useTheme } from "@/context/ThemeContext";

export default function DarkModeToggle() {
  const { toggleTheme } = useTheme();

  // The label is driven by the `dark` class rather than React state so it is
  // correct on the very first paint, before the provider has synced.
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
    >
      <span className="dark:hidden">🌙 Dark Mode</span>
      <span className="hidden dark:inline">🌞 Light Mode</span>
    </button>
  );
}

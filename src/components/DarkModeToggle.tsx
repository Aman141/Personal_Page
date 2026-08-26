"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function DarkModeToggle() {
  const { toggleTheme } = useTheme();

  // Which icon shows is decided by CSS (`dark:hidden` / `hidden dark:block`)
  // rather than React state, so it is already correct on the first paint —
  // before the provider has mounted. Reading the theme into state here would
  // reintroduce the flash the inline script in layout.tsx exists to prevent.
  //
  // The button lives in the header, which is dark in both themes, so its
  // colours are fixed white rather than adaptive ink tokens.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    </button>
  );
}

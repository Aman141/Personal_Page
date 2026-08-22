"use client";

import { createContext, useContext } from "react";

// No React state here on purpose. The `dark` class on <html> — applied before
// first paint by the inline script in layout.tsx — is the single source of
// truth, and DarkModeToggle picks its label with CSS (`dark:hidden` /
// `hidden dark:inline`) rather than reading a value from this context.
//
// An earlier version mirrored the class into useState and synced it in an
// effect. That copy was never read by anything, cost a render after hydration,
// and created a second source of truth that could disagree with the DOM.

const ThemeContext = createContext<{ toggleTheme: () => void }>({
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing or storage disabled — the class still applies for
      // this session, it just won't persist.
    }
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

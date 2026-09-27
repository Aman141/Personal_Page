"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Isolated as its own client component so the panel around it stays
// server-rendered — the email address and social links belong in the HTML.

export default function CopyEmailButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async (event) => {
        // This now sits beside the mailto link rather than on top of it, so
        // the guard is belt-and-braces — but it is what stops a copy click
        // from also opening the mail client if it is ever nested again.
        event.preventDefault();
        event.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard access can be denied; the mailto link still works.
        }
      }}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      className="relative z-10 shrink-0 rounded-full border border-line p-2 text-ink-faint transition-colors hover:bg-surface-subtle hover:text-ink"
    >
      {copied ? (
        <Check className="h-4 w-4 text-action" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

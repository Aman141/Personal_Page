"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Isolated as its own client component so the channel list around it stays
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
        // The row behind this button is a mailto link; without this a copy
        // click would also open the visitor's mail client.
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
      className="relative z-10 shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-purple-600 dark:hover:bg-gray-800 dark:hover:text-purple-400"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

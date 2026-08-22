"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD_CLASSES =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-950 dark:placeholder:text-gray-600";

const LABEL_CLASSES =
  "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "Please fill in every field.",
  invalid_email: "That email address doesn't look right.",
  too_long: "That message is longer than the form accepts.",
  not_configured: "The form isn't available right now — please use email.",
};

const FALLBACK_ERROR =
  "Something went wrong sending that. Please email me directly.";

export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"), // honeypot
        }),
      });

      if (!response.ok) {
        const { error: code } = await response
          .json()
          .catch(() => ({ error: null }));
        setError(ERROR_MESSAGES[code] ?? FALLBACK_ERROR);
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError(FALLBACK_ERROR);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        // aria-live so screen readers announce the outcome, since the form
        // that had focus has just been replaced.
        aria-live="polite"
        className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Message sent</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Thanks for reaching out — it landed in my inbox and I&apos;ll reply
          from there.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-purple-600 hover:underline dark:text-purple-400"
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <h2 className="text-lg font-semibold">Send a message</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Goes straight to my inbox.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={LABEL_CLASSES}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            disabled={sending}
            className={FIELD_CLASSES}
          />
        </div>

        <div>
          <label htmlFor="email" className={LABEL_CLASSES}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            disabled={sending}
            className={FIELD_CLASSES}
            placeholder="so I can reply"
          />
        </div>

        <div>
          <label htmlFor="message" className={LABEL_CLASSES}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            disabled={sending}
            className={`${FIELD_CLASSES} resize-y`}
          />
        </div>

        {/* Honeypot. Hidden from sight and from assistive tech, but a bot
            filling every field will trip it. Not `type="hidden"` — bots skip
            those; this has to look like a real input in the DOM. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {error}{" "}
            <a href={`mailto:${email}`} className="font-medium underline">
              {email}
            </a>
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

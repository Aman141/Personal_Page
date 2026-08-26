"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

// The form sits inside the dark contact panel, which is dark in both themes,
// so these are fixed white-on-dark rather than adaptive ink tokens.
const FIELD_CLASSES =
  "w-full rounded-lg border border-white/20 bg-black/30 px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent disabled:opacity-60";

const LABEL_CLASSES =
  "mono-label mb-2 block text-[11px] tracking-[0.14em] text-white/50";

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
        className="flex flex-col items-start rounded-[18px] border border-accent/28 bg-teal/40 p-7"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-deep">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <h2 className="mt-5 text-lg font-normal text-white">Message sent</h2>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed font-light text-white/70">
          Thanks for reaching out — it landed in my inbox and I&apos;ll reply
          from there.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mono-label mt-6 border-b border-accent/40 pb-1 text-[12px] tracking-[0.08em] text-accent transition-colors hover:text-white"
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
      className="rounded-[18px] border border-white/14 bg-white/6 p-7"
    >
      <h2 className="m-0 text-lg font-normal text-white">Send a message</h2>
      <p className="mt-2 text-[15px] font-light text-white/60">
        Goes straight to my inbox.
      </p>

      <div className="mt-7 space-y-4">
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
          className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-300/40 bg-amber-200/10 p-3.5 text-sm font-light text-amber-100"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {error}{" "}
            <a href={`mailto:${email}`} className="text-accent underline">
              {email}
            </a>
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3.5 text-[15px] text-deep transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60"
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

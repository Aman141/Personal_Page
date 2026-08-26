import { site } from "@/data/site";
import type { FormTone } from "./ContactForm";

const TONES: Record<FormTone, Record<string, string>> = {
  dark: {
    shell: "border-white/22 bg-white/6",
    heading: "text-white",
    body: "text-white/65",
    button: "bg-accent text-deep hover:bg-accent-soft",
  },
  light: {
    shell: "border-line bg-surface-subtle",
    heading: "text-ink",
    body: "text-ink-muted",
    button:
      "bg-deep text-white hover:bg-teal dark:bg-accent dark:text-deep dark:hover:bg-accent-soft",
  },
};

/**
 * Shown in place of the form when `RESEND_API_KEY` is absent.
 *
 * This is the load-bearing half of that check: a visible form that cannot send
 * loses real messages silently, so when sending is impossible the page has to
 * say so and point somewhere that works.
 */
export default function EmailFallback({ tone = "dark" }: { tone?: FormTone }) {
  const t = TONES[tone];

  return (
    <div className={`rounded-[18px] border border-dashed p-7 ${t.shell}`}>
      <h2 className={`m-0 text-lg font-normal ${t.heading}`}>
        Email is the fastest way
      </h2>
      <p className={`mt-3 text-[15px] leading-relaxed font-light ${t.body}`}>
        I&apos;d rather point you somewhere that works than show you a form that
        quietly drops your message. Drop me a line directly and I&apos;ll pick
        it up.
      </p>
      <a
        href={`mailto:${site.email}`}
        className={`mt-6 inline-block rounded-lg px-5 py-3 text-[15px] transition-colors ${t.button}`}
      >
        Write to me →
      </a>
    </div>
  );
}

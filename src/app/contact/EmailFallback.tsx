import { site } from "@/data/site";

/**
 * Shown in place of the form when `RESEND_API_KEY` is absent.
 *
 * This is the load-bearing half of that check: a visible form that cannot send
 * loses real messages silently, so when sending is impossible the page has to
 * say so and point somewhere that works. It sits in the form's slot, so it
 * matches the form's shell.
 */
export default function EmailFallback() {
  return (
    <div className="rounded-[18px] border border-dashed border-line bg-surface-subtle p-7">
      <h2 className="m-0 text-lg font-normal">Email is the fastest way</h2>
      <p className="mt-3 text-[15px] leading-relaxed font-light text-ink-muted">
        I&apos;d rather point you somewhere that works than show you a form that
        quietly drops your message. Drop me a line directly and I&apos;ll pick
        it up.
      </p>
      <a
        href={`mailto:${site.email}`}
        className="mt-6 inline-block rounded-lg bg-deep px-5 py-3 text-[15px] text-white transition-colors hover:bg-teal dark:bg-accent dark:text-deep dark:hover:bg-accent-soft"
      >
        Write to me →
      </a>
    </div>
  );
}

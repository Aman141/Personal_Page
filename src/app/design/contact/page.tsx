import type { Metadata } from "next";
import { ACTIVE, VARIANTS } from "@/app/contact/variants";

/**
 * TEMPORARY scaffolding: every /contact candidate stacked for comparison.
 *
 * Delete this route, `contact/variants/`, and the losing variants once one is
 * chosen. It is not in the sitemap (that is an explicit list) and is marked
 * noindex below, so it will not be crawled if it ships by accident.
 */
export const metadata: Metadata = {
  title: "Contact layouts",
  robots: { index: false, follow: false },
};

export default function ContactDesignPreview() {
  // Forced on rather than read from the environment. RESEND_API_KEY is not set
  // locally, so the real page falls back to the email panel — which would hide
  // the form in every variant and make them impossible to compare. /contact
  // still honours the real check.
  const formEnabled = true;
  const keyPresent = Boolean(process.env.RESEND_API_KEY);

  return (
    <div>
      <div className="bg-surface-subtle pt-14 pb-10">
        <div className="shell">
          <p className="mono-label mb-3.5 text-[12px] tracking-[0.14em] text-ink-muted">
            Design preview
          </p>
          <h1 className="m-0 max-w-[28ch] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.08] font-light tracking-[-0.018em]">
            Four layouts for the contact page.
          </h1>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed font-light text-ink-muted text-pretty">
            Each renders the same content and honours the same{" "}
            <code className="font-mono text-[0.9em]">RESEND_API_KEY</code> gate.
            They differ only in composition. Toggle the theme in the header to
            check both — variant C is the only one whose body responds to it.
          </p>
          {!keyPresent && (
            <p className="mt-5 max-w-[62ch] rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-sm leading-relaxed font-light text-amber-900 dark:border-amber-300/40 dark:bg-amber-200/10 dark:text-amber-100">
              <strong className="font-medium">Note:</strong> RESEND_API_KEY is
              not set in this environment, so the form is forced on here to make
              the layouts comparable. The real /contact is currently showing the
              email fallback panel instead.
            </p>
          )}
          <p className="mono-label mt-6 text-[11px] tracking-[0.14em] text-ink-faint">
            /contact currently serves: {ACTIVE}
          </p>
        </div>
      </div>

      {VARIANTS.map(({ key, name, tagline, Component }) => (
        <section key={key}>
          {/* Comes to rest just below the sticky header, which is ~67px tall
              unwrapped. Lower z-index than the header, so on a narrow viewport
              where the nav wraps taller this slides under it rather than over. */}
          <div className="sticky top-[4.25rem] z-30 border-y border-line bg-surface/95 backdrop-blur">
            <div className="shell flex flex-wrap items-baseline gap-x-5 gap-y-1.5 py-3.5">
              <h2 className="mono-label m-0 text-[12px] font-normal tracking-[0.14em] text-action">
                {name}
              </h2>
              <p className="text-sm font-light text-ink-muted">{tagline}</p>
              {key === ACTIVE && (
                <span className="mono-label ml-auto rounded-full border border-line px-2.5 py-1 text-[10px] tracking-[0.12em] text-ink-faint">
                  Live
                </span>
              )}
            </div>
          </div>

          <Component formEnabled={formEnabled} />
        </section>
      ))}
    </div>
  );
}

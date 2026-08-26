import { availability, site } from "@/data/site";
import ContactForm from "../ContactForm";
import CopyEmailButton from "../CopyEmailButton";
import EmailFallback from "../EmailFallback";
import { externalProps, socialChannels } from "../channels";

/**
 * Variant C — "Two-tone".
 *
 * The other two keep /contact dark from top to bottom, which makes it the only
 * route on the site that does. Everywhere else either opens dark and resolves
 * to light (home, project detail) or is light throughout (work index, blog,
 * about). This variant adopts that same rhythm: a compact dark header the
 * height of a project-page header, then the body on `--surface`.
 *
 * The practical win is the form. On the dark panel its fields are
 * `bg-black/30` inside `bg-white/6` on `--abyss` — three near-black layers
 * with only a 20%-white border separating a field from its card. On an
 * adaptive surface the fields use the ink tokens and follow the page theme,
 * which is the one place on this site where input legibility actually matters.
 */
export default function TwoTone({ formEnabled }: { formEnabled: boolean }) {
  return (
    <>
      <header className="bg-deep pt-18 pb-16">
        <div className="shell">
          {availability && (
            <p className="mono-label mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1.5 text-[11px] tracking-[0.12em] text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {availability}
            </p>
          )}

          <p className="mono-label mb-5.5 text-[12px] tracking-[0.16em] text-accent">
            Contact
          </p>
          <h1 className="m-0 max-w-[22ch] text-[clamp(2rem,4vw,3.625rem)] leading-[1.04] font-light tracking-[-0.02em] text-white">
            Happy to talk about signals, models or Berlin.
          </h1>
          <p className="mt-6.5 max-w-[56ch] text-lg leading-relaxed font-light text-white/70">
            Open to AI and ML engineering roles, and to any question about the
            work in the index. Email is fastest.
          </p>
        </div>
      </header>

      <section className="bg-surface pt-16 pb-24">
        <div className="shell flex flex-wrap items-start gap-x-16 gap-y-12">
          <div className="min-w-0 flex-[1_1_24rem]">
            {formEnabled ? (
              <ContactForm email={site.email} tone="light" />
            ) : (
              <EmailFallback tone="light" />
            )}
          </div>

          <div className="min-w-[16rem] flex-[1_1_18rem]">
            <p className="mono-label mb-4 text-[12px] tracking-[0.14em] text-ink-muted">
              Direct
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="border-b border-action/40 pb-1 text-[clamp(1rem,1.8vw,1.375rem)] font-light break-all text-action transition-colors hover:text-ink"
              >
                {site.email}
              </a>
              <CopyEmailButton value={site.email} tone="light" />
            </div>

            <ul className="mt-10 border-t border-line">
              {socialChannels.map(({ label, handle, href }) => (
                <li key={label} className="group border-b border-line-subtle">
                  <a
                    href={href}
                    {...externalProps(href)}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="mono-label w-20 shrink-0 text-[11px] tracking-[0.14em] text-ink-faint">
                      {label}
                    </span>
                    <span className="min-w-0 truncate text-[15px] font-light transition-colors group-hover:text-action">
                      {handle}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mono-label ml-auto text-[12px] text-ink-faint transition-colors group-hover:text-action"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mono-label mt-8 text-[11px] tracking-[0.14em] text-ink-faint">
              {site.location}, Germany · {site.timezone}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

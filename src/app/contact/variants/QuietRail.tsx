import { availability, site } from "@/data/site";
import ContactForm from "../ContactForm";
import CopyEmailButton from "../CopyEmailButton";
import EmailFallback from "../EmailFallback";
import { channels, externalProps } from "../channels";

/**
 * Variant A — "Quiet rail".
 *
 * Keeps the canvas's full-dark panel and changes only the hierarchy. In the
 * shipped version the page had two primary calls to action at the same visual
 * weight: a 34px display email address and a whole form, side by side, with
 * nothing to say which one to use.
 *
 * Here the form is unambiguously primary — it gets the wider column — and
 * every channel including email collapses into one compact rail of rows. The
 * address is still one click away and still copyable, it just no longer
 * competes with the thing next to it. The headline drops a size for the same
 * reason.
 */
export default function QuietRail({ formEnabled }: { formEnabled: boolean }) {
  return (
    <section className="relative overflow-hidden bg-abyss pt-24 pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:var(--gradient-radial)] opacity-45"
      />

      <div className="shell relative grid items-start gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          {availability && (
            <p className="mono-label mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1.5 text-[11px] tracking-[0.12em] text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {availability}
            </p>
          )}

          <p className="mono-label mb-5 text-[12px] tracking-[0.16em] text-accent">
            Contact
          </p>
          <h1 className="m-0 mb-6 max-w-[20ch] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.08] font-light tracking-[-0.018em] text-white">
            Happy to talk about signals, models or Berlin.
          </h1>
          <p className="mb-10 max-w-[46ch] text-base leading-relaxed font-light text-white/65">
            Open to AI and ML engineering roles, and to any question about the
            work in the index. The form goes straight to my inbox; everything
            else is below.
          </p>

          <ul className="border-t border-white/12">
            {channels.map(({ label, handle, href }) => (
              <li
                key={label}
                className="group flex items-center gap-4 border-b border-white/12"
              >
                <a
                  href={href}
                  {...externalProps(href)}
                  className="flex min-w-0 flex-1 items-baseline gap-4 py-4 text-white"
                >
                  <span className="mono-label w-20 shrink-0 text-[11px] tracking-[0.14em] text-white/45">
                    {label}
                  </span>
                  <span className="min-w-0 truncate text-[15px] font-light transition-colors group-hover:text-accent">
                    {handle}
                  </span>
                </a>
                {/* Only email gets a copy control — the rest are destinations,
                    not strings anyone needs on their clipboard. */}
                {href.startsWith("mailto:") && (
                  <CopyEmailButton value={site.email} />
                )}
              </li>
            ))}
          </ul>

          <p className="mono-label mt-8 text-[11px] tracking-[0.14em] text-white/40">
            {site.location}, Germany · {site.timezone}
          </p>
        </div>

        <div>
          {formEnabled ? <ContactForm email={site.email} /> : <EmailFallback />}
        </div>
      </div>
    </section>
  );
}

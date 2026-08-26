import { availability, site } from "@/data/site";
import ContactForm from "../ContactForm";
import CopyEmailButton from "../CopyEmailButton";
import EmailFallback from "../EmailFallback";
import { channels, externalProps } from "../channels";

/**
 * The shipped design, kept here unchanged so it can be compared against the
 * alternatives rather than remembered. Its known weaknesses, which the other
 * three each attack differently:
 *
 *   1. The display email and the form are two primary calls to action at the
 *      same visual weight, side by side, with nothing ranking them.
 *   2. The left column (headline, intro, display email, four social cells) is
 *      much taller than the form beside it, so the right column runs out early
 *      and leaves a void on wide screens.
 *   3. It is the only route on the site that is dark from top to bottom.
 *   4. The form's fields are three near-black layers deep.
 */
export default function Original({ formEnabled }: { formEnabled: boolean }) {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-abyss pt-25 pb-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[image:var(--gradient-radial)] opacity-45"
      />

      <div className="shell relative flex flex-wrap items-start gap-x-16 gap-y-14">
        <div className="min-w-0 flex-[1_1_26rem]">
          {availability && (
            <p className="mono-label mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1.5 text-[11px] tracking-[0.12em] text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {availability}
            </p>
          )}

          <p className="mono-label mb-6 text-[12px] tracking-[0.16em] text-accent">
            Contact
          </p>
          <h1 className="m-0 mb-8 max-w-[22ch] text-[clamp(1.875rem,4.2vw,3.625rem)] leading-[1.05] font-light tracking-[-0.02em] text-white">
            Happy to talk about signals, models or Berlin.
          </h1>
          <p className="mb-11 max-w-[52ch] text-lg leading-relaxed font-light text-white/70">
            Open to AI and ML engineering roles, and to any question about the
            work in the index. Email is fastest.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="border-b border-accent/40 pb-1.5 text-[clamp(1.25rem,2.6vw,2.125rem)] font-light break-all text-accent transition-colors hover:text-white"
            >
              {site.email}
            </a>
            <CopyEmailButton value={site.email} />
          </div>

          <ul className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(11.25rem,1fr))] gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12">
            {channels.map(({ label, handle, href }) => (
              // The cell carries the background so the 1px grid gaps read as
              // separators; the anchor fills it so the whole cell is the
              // hit area.
              <li
                key={label}
                className="bg-abyss/85 transition-colors hover:bg-teal/50"
              >
                <a
                  href={href}
                  {...externalProps(href)}
                  className="flex h-full flex-col gap-2 p-6 text-white"
                >
                  <span className="mono-label text-[11px] tracking-[0.14em] text-white/45">
                    {label}
                  </span>
                  <span className="text-base font-light break-all">
                    {handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-[17rem] flex-[1_1_23rem]">
          {formEnabled ? <ContactForm email={site.email} /> : <EmailFallback />}
        </div>
      </div>
    </section>
  );
}

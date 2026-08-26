import { availability, site } from "@/data/site";
import ContactForm from "../ContactForm";
import CopyEmailButton from "../CopyEmailButton";
import EmailFallback from "../EmailFallback";
import { externalProps, socialChannels } from "../channels";

/**
 * Variant B — "Editorial".
 *
 * The closest of the three to the design canvas, which put the email address
 * at display size and gave the page no form at all. It resolves the competing
 * calls to action by ranking them outright rather than balancing them: the
 * address is the page's one large gesture, the socials are a full-width band
 * under it, and the form follows in a narrower column below as the option for
 * people who would rather not open a mail client.
 *
 * Single column throughout, so there is no second column to run short and
 * leave a void beside the first.
 */
export default function Editorial({ formEnabled }: { formEnabled: boolean }) {
  return (
    <>
      <section className="relative overflow-hidden bg-abyss pt-26 pb-18">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[image:var(--gradient-radial)] opacity-45"
        />

        <div className="shell relative">
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
          <h1 className="m-0 mb-8 max-w-[20ch] text-[clamp(2rem,5vw,4.25rem)] leading-[1.02] font-light tracking-[-0.022em] text-white">
            Happy to talk about signals, models or Berlin.
          </h1>
          <p className="mb-14 max-w-[52ch] text-lg leading-relaxed font-light text-white/70">
            Open to AI and ML engineering roles, and to any question about the
            work in the index. Email is fastest.
          </p>

          <p className="mono-label mb-4 text-[11px] tracking-[0.14em] text-white/40">
            Write to me
          </p>
          {/* The one oversized element on the page. Nothing else competes with
              it, which is the entire argument for this variant. */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="border-b border-accent/40 pb-2 text-[clamp(1.375rem,3.6vw,2.75rem)] leading-tight font-light break-all text-accent transition-colors hover:text-white"
            >
              {site.email}
            </a>
            <CopyEmailButton value={site.email} />
          </div>
        </div>
      </section>

      <section className="bg-abyss">
        <div className="shell">
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(11.25rem,1fr))] gap-px border-y border-white/12 bg-white/12">
            {socialChannels.map(({ label, handle, href }) => (
              <li
                key={label}
                className="bg-abyss transition-colors hover:bg-teal/50"
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
      </section>

      <section className="bg-deep pt-20 pb-24">
        <div className="shell max-w-[40rem]">
          <p className="mono-label mb-4 text-[12px] tracking-[0.16em] text-accent">
            Or use a form
          </p>
          <h2 className="m-0 mb-9 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.12] font-light tracking-[-0.015em] text-white">
            If you would rather not open a mail client.
          </h2>
          {formEnabled ? <ContactForm email={site.email} /> : <EmailFallback />}
        </div>
      </section>
    </>
  );
}

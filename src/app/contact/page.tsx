import type { Metadata } from "next";
import { availability, site } from "@/data/site";
import ContactForm from "./ContactForm";
import CopyEmailButton from "./CopyEmailButton";
import EmailFallback from "./EmailFallback";
import { externalProps, socialChannels } from "./channels";

const description =
  "Get in touch with Aman Kumar — AI Engineer in Berlin working on machine learning for underwater acoustics.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", description, url: "/contact" },
};

/**
 * Two-tone: a compact dark header the height of a project-page header, then
 * the body on `--surface`.
 *
 * The dark band stops at the header deliberately. Every other route either
 * opens dark and resolves to light (home, project detail) or is light
 * throughout (work index, blog, about) — a page that stayed dark to the footer
 * would be the only one on the site that does.
 *
 * It also puts the form somewhere it reads. On a dark panel the fields are
 * three near-black layers deep, separated from their card by a single
 * 20%-white border; on an adaptive surface they use the ink tokens and follow
 * the page theme, which matters more here than anywhere else on the site.
 */
export default function ContactPage() {
  // Read server-side so the form is never rendered when it cannot send.
  // Showing a dead form would silently lose messages — the one outcome this
  // page must not have. The API route re-checks the same variable, because
  // build-time and runtime config can differ.
  //
  // Note this is read at BUILD time: the page is statically generated, so
  // adding the key on Vercel needs a redeploy to take effect.
  const formEnabled = Boolean(process.env.RESEND_API_KEY);

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
          {/* The form is the primary action and takes the wider column. The
              address is still one click away in the rail beside it, but at
              body size rather than as a second display-sized call to action
              competing with this one. */}
          <div className="min-w-0 flex-[1_1_24rem]">
            {formEnabled ? (
              <ContactForm email={site.email} />
            ) : (
              <EmailFallback />
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
              <CopyEmailButton value={site.email} />
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

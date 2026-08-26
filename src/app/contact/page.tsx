import type { Metadata } from "next";
import { ACTIVE, VARIANTS } from "./variants";

const description =
  "Get in touch with Aman Kumar — AI Engineer in Berlin working on machine learning for underwater acoustics.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", description, url: "/contact" },
};

export default function ContactPage() {
  // Read server-side so the form is never rendered when it cannot send.
  // Showing a dead form would silently lose messages — the one outcome this
  // page must not have. The API route re-checks the same variable, because
  // build-time and runtime config can differ.
  //
  // Note this is read at BUILD time: the page is statically generated, so
  // adding the key on Vercel needs a redeploy to take effect.
  const formEnabled = Boolean(process.env.RESEND_API_KEY);

  const { Component } = VARIANTS.find((v) => v.key === ACTIVE) ?? VARIANTS[0];

  return <Component formEnabled={formEnabled} />;
}

import { NextResponse } from "next/server";
import { site } from "@/data/site";

// Sends contact-form submissions on to `site.email` via Resend's REST API.
// Called with fetch rather than the Resend SDK so this adds no dependency.
//
// Setup: add RESEND_API_KEY to the Vercel project. That is the only required
// variable — the default sender below works without domain verification.
// The page checks the same variable server-side and hides the form entirely
// when it is absent, so a visitor can never submit into a void; this handler
// re-checks anyway, because config can differ between build and runtime.

/**
 * Resend's shared sender needs no DNS setup but only delivers to the address
 * that owns the Resend account. That is exactly this use case (mail to self).
 * Set CONTACT_FROM_EMAIL once you have a verified domain.
 */
const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

const LIMITS = { name: 100, email: 200, message: 5000 };

// Deliberately permissive: the only claim worth making here is "looks like an
// address". Real validation is whether the reply lands.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail("not_configured", 503);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("invalid_request", 400);
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  // Honeypot: the field is hidden from real users, so anything in it is a bot.
  // Returns 200 so a crawler can't tell acceptance from rejection.
  if (String(body.company ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) return fail("missing_fields", 400);
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return fail("too_long", 400);
  }
  if (!EMAIL_PATTERN.test(email)) return fail("invalid_email", 400);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM,
        to: [site.email],
        // So hitting reply in the mail client answers the sender, not Resend.
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      // Logged server-side only; the client gets a generic message rather
      // than provider internals.
      console.error("[contact] resend rejected", {
        status: response.status,
        body: await response.text().catch(() => "<unreadable>"),
      });
      return fail("send_failed", 502);
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[contact] could not reach resend", cause);
    return fail("send_failed", 502);
  }
}

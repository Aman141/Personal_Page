import { site } from "@/data/site";

/**
 * The ways to reach me, in the order they are worth trying. Email first
 * because it is the only one that reaches a person rather than a profile —
 * every layout in `variants/` relies on that ordering.
 */
export const channels = [
  { label: "Email", handle: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", handle: "Aman141", href: site.social.github },
  { label: "LinkedIn", handle: "aman-aks-007", href: site.social.linkedin },
  { label: "Medium", handle: "@aman-ai", href: site.social.medium },
] as const;

/** Everything except email — for layouts that give the address its own slot. */
export const socialChannels = channels.filter(
  (c) => !c.href.startsWith("mailto:"),
);

/** `mailto:` must not open in a new tab; the rest should. */
export const externalProps = (href: string) =>
  href.startsWith("mailto:")
    ? {}
    : { target: "_blank" as const, rel: "noopener noreferrer" };

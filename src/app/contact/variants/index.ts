import Original from "./Original";
import QuietRail from "./QuietRail";
import Editorial from "./Editorial";
import TwoTone from "./TwoTone";

/**
 * Candidate layouts for /contact, kept side by side while one is chosen.
 *
 * All four render the same content and honour the same `formEnabled` gate —
 * they differ only in composition. `/design/contact` stacks them for
 * comparison; `/contact` renders whichever `ACTIVE` names.
 *
 * This is scaffolding. Once a variant is picked, point `ACTIVE` at it, delete
 * the other three files and this module, and inline the winner into
 * `contact/page.tsx`.
 */
export const VARIANTS = [
  {
    key: "original",
    name: "Original",
    tagline: "The shipped design — full-dark, two columns.",
    Component: Original,
  },
  {
    key: "quiet-rail",
    name: "A · Quiet rail",
    tagline:
      "Same dark panel, hierarchy fixed: form is primary, every channel collapses into one compact rail.",
    Component: QuietRail,
  },
  {
    key: "editorial",
    name: "B · Editorial",
    tagline:
      "Closest to the canvas. The email address is the page; the form follows below as the alternative.",
    Component: Editorial,
  },
  {
    key: "two-tone",
    name: "C · Two-tone",
    tagline:
      "Dark header, light body — the rhythm the rest of the site already uses. Best form legibility.",
    Component: TwoTone,
  },
] as const;

export type VariantKey = (typeof VARIANTS)[number]["key"];

/** Which layout /contact currently serves. */
export const ACTIVE: VariantKey = "original";

// Single source of truth for identity and contact details, used by the metadata
// in layout.tsx, the sitemap, the generated OG image, and the footer.

const PRODUCTION_URL = "https://aman-kumar-ai.vercel.app";

/**
 * Absolute origin, required by `metadataBase` so Open Graph and canonical URLs
 * resolve. Pinned to the known production domain rather than derived from
 * Vercel's env vars, so canonical tags can't silently point at a preview
 * deployment's URL. Override with NEXT_PUBLIC_SITE_URL if the domain changes.
 */
const resolveSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV === "production") return PRODUCTION_URL;
  return "http://localhost:3000";
};

export const site = {
  name: "Aman Kumar",
  role: "AI Engineer",
  location: "Berlin",
  timezone: "CET",
  // Reaches further than it looks: this one string is the meta description on
  // every page without its own, the Open Graph and Twitter description, and the
  // body copy rendered into the generated OG image, which lays it out at 26px
  // in a 900px box. Keep it near this length or that card wraps badly.
  //
  // It named underwater acoustics until the hero and /about broadened to
  // detection and tracking across both modalities; leaving it behind meant the
  // two pages a reader actually reads disagreed with what search results and
  // link previews showed.
  description:
    "AI Engineer in Berlin working on machine learning for detection and tracking in video and audio, with projects in signal processing and Bayesian modelling.",
  url: resolveSiteUrl(),
  email: "aman141kumar.ak@gmail.com",
  social: {
    github: "https://github.com/Aman141",
    linkedin: "https://www.linkedin.com/in/aman-aks-007/",
    twitter: "https://x.com/twt2aman",
    twitterHandle: "@twt2aman",
    instagram: "https://www.instagram.com/happy._.habitat/",
    medium: "https://medium.com/@aman-ai",
  },
} as const;

export const siteTitle = `${site.name} — ${site.role}`;

/**
 * The two faces the hero cycles through. This replaces the old static
 * "AI Engineer | Software Developer | Traveler | Photographer" tagline — first
 * by giving each of those four a headline and specs instead of a word in a
 * pipe-separated list, and now by dropping the Photographer and Traveler
 * personas outright. The hero is the first thing a hiring reader sees and it
 * was spending half its rotation on hobbies; the personal material belongs on
 * /about, which still carries it.
 *
 * Nothing else in the codebase referenced those two, so this is a pure
 * deletion — but note it also removes the only place the site presented itself
 * as anything other than professional.
 *
 * Each persona says a thing once. The body is one sentence and the specs are
 * whatever the eyebrow, headline and body have not already said — the first
 * screen once stated the same claim three times and named Berlin three times,
 * which is most of what made it read as wall-of-text.
 *
 * Keep it at exactly two specs per persona. The panel has no min-height, so an
 * uneven count makes the card resize as the carousel steps.
 *
 * `href` must resolve to a real route — the CTA is a `next/link`, so a typo is
 * a 404 rather than a no-op.
 */
export const personas = [
  {
    eyebrow: `${site.role} / ${site.location}`,
    // Deliberately broader than the day job. The previous headline named
    // underwater acoustics, which is one employer's domain rather than a
    // transferable skill; detection and tracking is the thing that carries
    // across video and audio, and the specs below name the tools for each.
    headline: "Detection and tracking in video and audio.",
    body: "Frames and waveforms in, detections and tracks out.",
    ctaLabel: "See the work",
    href: "/projects",
    specs: [
      { label: "Video", value: "YOLO detectors, multi-object tracking" },
      { label: "Audio", value: "YAMNet, MFCC features, CNN classifiers" },
    ],
  },
  {
    eyebrow: "Software Developer",
    headline: "Interfaces and pipelines that make a model usable.",
    body: "A model nobody can query is a notebook, so I build the retrieval, the API and the front end too.",
    ctaLabel: "Open RAGdemo",
    href: "/projects/ragdemo",
    specs: [
      { label: "Stack", value: "Next.js 16, React 19, TypeScript" },
      { label: "Shipped", value: "AirConnect, RAGdemo, DeutschCard" },
    ],
  },
] as const;

/** The four-cell grid on /about. */
export const aboutFacts = [
  { label: "Role", value: "AI Engineer" },
  { label: "City", value: "Berlin, DE" },
  { label: "Writing", value: "Medium, Git series" },
  { label: "Open to", value: "AI / ML roles" },
] as const;

/**
 * Availability pill on /contact. Set to a short string to show it — e.g.
 * "Open to freelance work" or "Open to research collaboration" — or leave it
 * null to hide it. Deliberately off by default: this page is public, and a
 * job-seeking signal is visible to current colleagues too.
 */
export const availability: string | null = null;

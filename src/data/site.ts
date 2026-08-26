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
  description:
    "AI Engineer in Berlin working on machine learning for underwater acoustic detection and tracking, with projects in signal processing and Bayesian modelling.",
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
 * The four faces the hero cycles through. This replaces the old static
 * "AI Engineer | Software Developer | Traveler | Photographer" tagline: the
 * same four roles, but each one gets a headline and three specs instead of
 * being a word in a pipe-separated list.
 *
 * `href` must resolve to a real route — the CTA is a `next/link`, so a typo is
 * a 404 rather than a no-op.
 */
export const personas = [
  {
    eyebrow: `${site.role} / ${site.location}`,
    headline:
      "Machine learning for underwater acoustic detection and tracking.",
    body: "Noisy hydrophone data in, detections and tracks out. Signal processing, Bayesian modelling, and the pipelines that keep both honest.",
    ctaLabel: "See the work",
    href: "/projects",
    specs: [
      { label: "Focus", value: "Detection & tracking in acoustic signals" },
      { label: "Methods", value: "CNNs, Bayesian inference, MFCC features" },
      { label: "Based", value: "Berlin, Germany" },
    ],
  },
  {
    eyebrow: "Software Developer",
    headline: "Interfaces and pipelines that make a model usable.",
    body: "A model nobody can query is a notebook. I build the retrieval, the API and the front end so results reach the people who need them.",
    ctaLabel: "Open RAGdemo",
    href: "/projects/ragdemo",
    specs: [
      { label: "Stack", value: "Next.js 16, React 19, TypeScript" },
      { label: "Shipped", value: "AirConnect, RAGdemo, DeutschCard" },
      { label: "Approach", value: "Few dependencies, no build-step magic" },
    ],
  },
  {
    eyebrow: "Photographer",
    headline: "Light, water, and the people in between.",
    body: "The same attention that finds a signal in noise is useful behind a viewfinder. Mostly landscape and street, mostly in Europe.",
    ctaLabel: "About me",
    href: "/about",
    specs: [
      { label: "Subjects", value: "Landscape, street, water" },
      { label: "Kit", value: "Digital, one prime lens" },
      { label: "Where", value: "Berlin and wherever the train goes" },
    ],
  },
  {
    eyebrow: "Traveler",
    headline: "Long routes, slow trains, unfamiliar languages.",
    body: "Berlin is the base. German is somewhere between B1 and comfortable, which is why one of my projects is a flashcard app.",
    ctaLabel: "Open DeutschCard",
    href: "/projects/deutschcard",
    specs: [
      { label: "Base", value: "Berlin, Germany" },
      { label: "Mode", value: "Slow, overland, off-season" },
      { label: "Learning", value: "German, CEFR A1–B2 and climbing" },
    ],
  },
] as const;

/** The four-cell strip directly under the hero. */
export const nowFacts = [
  { label: "Now", value: "ML for underwater acoustics" },
  { label: "Tools", value: "Python, TensorFlow, PyMC, Next.js" },
  { label: "Based", value: "Berlin, Germany" },
  { label: "Writing", value: "Git series on Medium" },
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

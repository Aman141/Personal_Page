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

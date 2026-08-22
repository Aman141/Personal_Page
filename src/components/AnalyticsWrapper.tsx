import { Analytics } from "@vercel/analytics/next";

// Analytics stays off in development so local traffic never reaches production
// stats; set NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false to opt out in production.
const enabled =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "false";

export function AnalyticsWrapper() {
  if (!enabled) return null;
  return <Analytics />;
}

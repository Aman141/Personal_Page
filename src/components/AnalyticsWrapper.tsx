import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Both stay off in development so local traffic never reaches production stats
// and no beacons fire while you work; set
// NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false to opt out in production too.
const enabled =
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED !== "false";

export function AnalyticsWrapper() {
  if (!enabled) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

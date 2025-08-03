"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";

export function AnalyticsWrapper() {
  useEffect(() => {
    // Log analytics events in development
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Analytics would be tracked here in production");

      // Track page views in development
      const trackPageView = () => {
        console.log("📊 Page view tracked:", window.location.pathname);
      };

      trackPageView();

      // Track navigation
      const handleRouteChange = () => {
        console.log("🔄 Route change tracked:", window.location.pathname);
      };

      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, []);

  // Only render Vercel Analytics in production
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return <Analytics />;
}

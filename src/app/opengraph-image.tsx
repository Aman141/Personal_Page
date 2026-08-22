import { ImageResponse } from "next/og";
import { site, siteTitle } from "@/data/site";

// Generated at build time rather than shipping a static asset, so the preview
// card can never drift out of sync with site.ts. Next.js wires the result into
// og:image and twitter:image automatically.
//
// This renders through Satori, which supports only a subset of CSS: flexbox
// (no grid), and every element with more than one child needs an explicit
// `display: "flex"`.

export const alt = siteTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, #4c1d95 0%, transparent 45%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "120px",
            height: "8px",
            borderRadius: "4px",
            backgroundImage: "linear-gradient(90deg, #a855f7, #6366f1)",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: "40px",
            fontSize: "84px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "12px",
            fontSize: "40px",
            color: "#c4b5fd",
          }}
        >
          {site.role} · {site.location}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "32px",
            maxWidth: "900px",
            fontSize: "26px",
            lineHeight: 1.5,
            color: "#9ca3af",
          }}
        >
          {site.description}
        </div>
      </div>
    ),
    size
  );
}

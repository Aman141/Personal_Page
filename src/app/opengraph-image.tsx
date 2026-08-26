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
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // Literals rather than the CSS tokens: Satori resolves no custom
        // properties, so globals.css is not in scope here. These are the
        // --abyss / --teal / --accent values.
        backgroundColor: "#000d19",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, #004144 0%, transparent 48%)",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "120px",
          height: "8px",
          borderRadius: "4px",
          backgroundColor: "#82cfff",
        }}
      />
      <div
        style={{
          display: "flex",
          marginTop: "40px",
          fontSize: "84px",
          fontWeight: 300,
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
          color: "#82cfff",
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
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {site.description}
      </div>
    </div>,
    size,
  );
}

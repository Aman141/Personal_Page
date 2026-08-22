import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Medium article thumbnails (miro.medium.com, cdn-images-*.medium.com).
    // useMediumPosts drops any thumbnail outside this host so next/image
    // can never be handed an unconfigured domain at runtime.
    remotePatterns: [{ protocol: "https", hostname: "**.medium.com" }],
  },
};

export default nextConfig;

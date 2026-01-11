import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pleasant-puffin-156.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "proficient-eel-711.convex.cloud",
      },
    ],
  },
};

export default nextConfig;

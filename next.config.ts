import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No staleTimes needed - let pages stay cached indefinitely

  // Optimize caching for instant navigation
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=31536000, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

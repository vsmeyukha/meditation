import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configure client router cache for better prefetching
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 300, // 5 minutes for static routes
    },
  },

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

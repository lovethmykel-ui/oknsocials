import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress X-Powered-By header for security
  poweredByHeader: false,

  // Images — allow Unsplash remote patterns
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const base = process.env.API_BASE_URL ?? "http://localhost:3000";
    // ponytail: proxy backend via rewrites — browser same-origin, CORS selesai
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
};

export default nextConfig;

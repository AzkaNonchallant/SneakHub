import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const base = process.env.API_BASE_URL ?? "http://localhost:3000";
    // ponytail: proxy backend via rewrites — browser same-origin, CORS selesai
    return [{ source: "/api/:path*", destination: `${base}/api/:path*` }];
  },
  async headers() {
    return [
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // ponytail: image unoptimized — backend URL user-generated, optimizer butuh sharp
  // yang di-ignore di package.json; next/image tetap dipakai untuk CLS/layout
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api-sneakhub.reihan.biz.id" },
    ],
  },
};

export default nextConfig;
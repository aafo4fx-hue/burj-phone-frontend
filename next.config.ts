import type { NextConfig } from "next";
import path from "path";

// 'unsafe-eval' is only needed in development — React uses eval() for
// enhanced error stack reconstruction. Neither React nor Next.js use eval
// in production builds (confirmed in Next.js 16 CSP docs).
const isDev = process.env.NODE_ENV === "development";

// Base CSP applied via next.config headers (static pages / ISR).
// For fully dynamic pages that need per-request nonces, a proxy.ts approach
// would be required — but that forces all pages to dynamic rendering and
// disables ISR/Full Route Cache. The current static-header approach is the
// correct trade-off for this ISR-heavy application.
const cspHeader = [
  "default-src 'self'",
  // unsafe-inline kept: Next.js inlines styles for RSC streaming and the
  // Saudi Business seal script requires it. unsafe-eval removed in production.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://eauthenticate.saudibusiness.gov.sa`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com https://i.ibb.co https://ibb.co https://eauthenticate.saudibusiness.gov.sa",
  "font-src 'self'",
  "connect-src 'self' https://res.cloudinary.com https://eauthenticate.saudibusiness.gov.sa",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/sitemap.xml", destination: "/sitemap.xml" },
        { source: "/robots.txt", destination: "/robots.txt" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    // Raised from 60s → 86400s (24 hours).
    // Product and company images are stored on Cloudinary and rarely change;
    // a 60s TTL caused Next.js Image Optimization to re-process and re-cache
    // the same images every minute, generating unnecessary Function invocations.
    // 86400s matches Cloudinary's own CDN delivery TTL for transformed images.
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { hostname: "ibb.co" },
      { hostname: "i.ibb.co" },
      { protocol: "https", hostname: "burjjstorre.com" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "5000", pathname: "/**" },
    ],
  },
};

export default nextConfig;

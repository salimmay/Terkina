import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy — allows Supabase, Cloudinary, Unsplash and wa.me
const cspDirectives = [
  "default-src 'self';",
  // 'unsafe-eval'/'unsafe-inline' required by Three.js (WebGL) & Framer Motion
  "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
  "style-src 'self' 'unsafe-inline';",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com;",
  "media-src 'self' data: blob: https://res.cloudinary.com;",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://res.cloudinary.com;",
  "font-src 'self' data:;",
  "object-src 'none';",
  "base-uri 'self';",
  "form-action 'self' https://wa.me;",
  "frame-ancestors 'none';",
].join(" ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hide the X-Powered-By header so attackers can't fingerprint the stack
  poweredByHeader: false,
  // Standalone output for Docker containerization
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent Clickjacking (disallow embedding in iframes)
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer privacy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable unneeded browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Enforce HTTPS (2 years, includes subdomains)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // CSP (relaxed in dev for hot-reload websockets)
          {
            key: "Content-Security-Policy",
            value: isDev
              ? cspDirectives.replace(
                  "connect-src 'self'",
                  "connect-src 'self' ws: http://localhost:*"
                )
              : cspDirectives,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

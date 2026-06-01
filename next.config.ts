import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical host: permanent (308) www → apex. Fires once www.unitcrate.com
      // is attached to the project in Vercel (DNS). Apex is canonical.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.unitcrate.com" }],
        destination: "https://unitcrate.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Default-deny framing site-wide (embed routes opt back in if added).
      {
        source: "/((?!embed).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

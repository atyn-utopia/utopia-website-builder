import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical domain — send the old host to rsvp.utopiaai.my (same path).
      {
        source: "/:path*",
        has: [{ type: "host", value: "hollywood-night.utopiaai.my" }],
        destination: "https://rsvp.utopiaai.my/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

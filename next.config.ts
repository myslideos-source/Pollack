import type { NextConfig } from "next";
import { legacyRedirects } from "./src/content/legacy-redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
  },
};

export default nextConfig;

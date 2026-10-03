import type { NextConfig } from "next";
const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [80, 85, 90] },
  poweredByHeader: false,
};
export default config;

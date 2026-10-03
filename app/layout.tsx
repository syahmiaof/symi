import type { Metadata, Viewport } from "next";
import { Bodoni_Moda } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./reference.css";
const display = Bodoni_Moda({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: [
    { path: "./fonts/manrope-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/manrope-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/manrope-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/manrope-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "SYMI — Crafted Frozen Yogurt",
  description:
    "Real ingredients. Pure joy. Explore the SYMI swirl and a brighter way to frozen yogurt. Launching 2027.",
  openGraph: {
    title: "SYMI — Good Yogurt. Brighter Days.",
    description:
      "Crafted frozen yogurt. Real ingredients. Pure joy. Launching 2027.",
    type: "website",
    images: [
      {
        url: "/images/symi/flavors-flatlay.webp",
        width: 1254,
        height: 1254,
        alt: "Four SYMI frozen yogurt flavors",
      },
    ],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#06263B",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}

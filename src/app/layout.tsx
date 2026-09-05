import type { Metadata } from "next";
import { Syne, Inter, Cairo } from "next/font/google";
import ClientShell from "@/components/providers/ClientShell";
import GoldenCursorTrail from "@/components/GoldenCursorTrail";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

const fontHeading = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fontArabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://terkina.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TERKINA | Cinematic Visual Media Studio & Additive 3D Lab",
    template: "%s | TERKINA",
  },
  description:
    "Tunisia’s premier hybrid creative studio. Luxury wedding cinema (Med Art), commercial advertising production, and precision 3D additive manufacturing.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/?lang=en",
      "fr-FR": "/?lang=fr",
      "ar-TN": "/?lang=ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "TERKINA",
    title: "TERKINA — Fusing Cinematic Visuals With Physical 3D Precision",
    description:
      "Med Art Luxury Weddings, Commercial Event Production, and Physical 3D Additive Fabrication.",
    // Image comes from the `opengraph-image.png` file convention in this
    // directory — listing it here too would emit a duplicate og:image tag.
  },
  twitter: {
    card: "summary_large_image",
    title: "TERKINA | Cinematic Visual Media & 3D Lab",
    description: "Luxury Weddings, Commercial Advertising, and Precision 3D Printing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontArabic.variable} h-full antialiased dark`}
    >
      <head>
        {/* Global Studio Structured Data for Google */}
        <JsonLd type="studio" />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        {/* Luxurious Gold Light Trail */}
        <GoldenCursorTrail />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}


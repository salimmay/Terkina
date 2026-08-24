import type { Metadata } from "next";
import { Syne, Inter, Cairo } from "next/font/google";
import ClientShell from "@/components/providers/ClientShell";
import GoldenCursorTrail from "@/components/GoldenCursorTrail";
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

export const metadata: Metadata = {
  title: "TERKINA & MED ART | Luxury Wedding & Commercial Video Production",
  description: "Bespoke luxury wedding photography by MED ART and high-impact commercial video production, advertising campaigns, and event coverage by TERKINA.",
  metadataBase: new URL("https://terkina.com"),
  openGraph: {
    title: "TERKINA & MED ART — Luxury Weddings & Commercial Production",
    description: "Cinematic Wedding Photography & High-Impact Commercial Video Production House.",
    url: "https://terkina.com",
    siteName: "TERKINA",
    images: [
      {
        url: "/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "TERKINA & MED ART Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TERKINA & MED ART",
    description: "Luxury Weddings & Commercial Production",
    images: ["/og-preview.jpg"],
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
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        {/* Luxurious Gold Light Trail */}
        <GoldenCursorTrail />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

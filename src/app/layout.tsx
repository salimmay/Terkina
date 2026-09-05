import type { Metadata } from "next";
import { Syne, Inter, Cairo } from "next/font/google";
import ClientShell from "@/components/providers/ClientShell";
import { LocaleProvider } from "@/context/LocaleContext";
import { buildMetadata } from "@/lib/seo";
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

// Page titles are complete on their own (see src/lib/seo.ts), so no "%s |
// TERKINA" template — it would double the brand name in every title.
// Social images come from the opengraph-image.png file convention.
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  ...buildMetadata("home", "en"),
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
        {/* Locale is read from the URL inside the provider, which keeps every
            page statically prerenderable — reading it from headers() here
            would opt the entire site out of static rendering. */}
        <LocaleProvider>
          <ClientShell>{children}</ClientShell>
        </LocaleProvider>
      </body>
    </html>
  );
}


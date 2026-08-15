import type { Metadata } from "next";
import { Syne, Inter, Cairo } from "next/font/google";
import ClientShell from "@/components/providers/ClientShell";
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
  title: "TERKINA | Hybrid Studio — Cinematic Photography & 3D Engineering",
  description: "Precision 3D additive manufacturing, architectural photography, and digital generative artifacts.",
  metadataBase: new URL("https://terkina.com"),
  openGraph: {
    title: "TERKINA — Fusing Visual Artistry With Physical Precision",
    description: "Cinematic Photography & Additive 3D Manufacturing Studio.",
    url: "https://terkina.com",
    siteName: "TERKINA",
    images: [
      {
        url: "/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "TERKINA Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TERKINA Hybrid Studio",
    description: "Cinematic Photography & 3D Printing",
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
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

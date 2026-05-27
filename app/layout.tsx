import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "2soulfilms — We Make Wedding Stories | Wedding Films",
  description:
    "Beyond The Destination, You Can Always Memorize. Cinematic wedding films by 2soulfilms. Serving couples all over India.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "2soulfilms — We Make Wedding Stories",
    description:
      "Beyond The Destination, You Can Always Memorize. Cinematic wedding films serving all of India.",
    type: "website",
    siteName: "2soulfilms",
    url: "https://www.2soulfilms.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 800,
        alt: "2soulfilms — Cinematic Wedding Films",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2soulfilms — We Make Wedding Stories",
    description: "Beyond The Destination, You Can Always Memorize.",
    images: ["/og-image.jpg"],
  },
  keywords: [
    "wedding films",
    "wedding videography",
    "pre-wedding shoot",
    "2soulfilms",
    "Sreeyam Behera",
    "Bhubaneswar wedding filmmaker",
    "Odisha wedding films",
    "cinematic wedding",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#F8F4EE] text-[#0B0F19]`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

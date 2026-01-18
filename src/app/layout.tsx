import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ET Shoes – Direct Seller Marketplace",
  description:
    "ET Shoes is a trusted direct seller marketplace for men, women, and kids shoes. Browse products, connect with sellers, and shop securely.",
  keywords: [
    "ET Shoes",
    "Buy shoes online",
    "Men's shoes",
    "Women's shoes",
    "Kids shoes",
    "Direct seller marketplace",
    "WhatsApp checkout",
    "Fashion shoes",
  ],
  authors: [{ name: "Natnael Kassahun", url: "https://yourwebsite.com" }],
  creator: "Natnael Kassahun",
  publisher: "ET Shoes",
  openGraph: {
    title: "ET Shoes – Direct Seller Marketplace",
    description:
      "Browse and buy trusted shoes directly from verified sellers. Shop men, women, and kids shoes online.",
    url: "https://yourwebsite.com",
    siteName: "ET Shoes",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png", // Create a custom OG image for social sharing
        width: 1200,
        height: 630,
        alt: "ET Shoes – Direct Seller Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ET Shoes – Direct Seller Marketplace",
    description:
      "Browse and buy trusted shoes directly from verified sellers. Shop men, women, and kids shoes online.",
    creator: "@yourTwitterHandle", // Optional
    images: ["https://yourwebsite.com/og-image.png"],
  },
  metadataBase: new URL("https://yourwebsite.com"), // Needed for canonical URLs
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}

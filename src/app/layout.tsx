import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowtusk - Find Who You're Selling To in Minutes Not Weeks",
  description: "Paste your website URL. Get customer clarity. Export ready-to-use templates—emails, landing pages, LinkedIn, pitch decks—rooted in real customer insights. All in 15 minutes.",
  keywords: "customer personas, ideal customer profile, B2B marketing, landing page generator, email templates, LinkedIn content, pitch deck, customer insights",
  openGraph: {
    title: "Flowtusk - Find Who You're Selling To in Minutes Not Weeks",
    description: "Get customer clarity and ready-to-use marketing templates in 15 minutes. No credit card required.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}

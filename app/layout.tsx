import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupabaseProvider from "@/lib/supabase-provider";

// Optimize font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Interior Designer AI",
  description: "Upload a sample room photo and get a design back in seconds.",
  robots: "index, follow",
  keywords: "interior design, AI, room design, home decoration",
  authors: [{ name: "Interior Designer AI Team" }],
  openGraph: {
    title: "ReRoom AI - Interior Designer AI",
    description: "Upload a sample room photo and get a design back in seconds.",
    url: "https://iftikhar.vercel.app/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://iftikhar.vercel.app/app-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Screenshot of the ReRoom AI app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer AI",
    description: "Upload a sample room photo and get a design back in seconds.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased`}
      >
        <SupabaseProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}

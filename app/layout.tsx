import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar, { ReadingNavProvider } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scheherazade_New, Inter } from "next/font/google";
import { SettingsProvider } from "@/context/SettingsContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import CommandPalette from "@/components/CommandPalette";

const scheherazade = Scheherazade_New({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-Scheherazade_New",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quran App - Read the Holy Quran",
    template: "%s | Quran App",
  },
  description: "A modern, beautiful, and ad-free Quran reading experience. Read the Holy Quran with an elegant interface.",
  keywords: ["Quran", "Holy Quran", "Islamic", "Muslim", "Arabic", "Athkar", "Quran App"],
  authors: [{ name: "Awab Elkhalil", url: "https://awab.design" }],
  creator: "Awab Elkhalil",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quran.awab.design",
    siteName: "Quran App",
    title: "Quran App - Read the Holy Quran",
    description: "A modern, beautiful, and ad-free Quran reading experience.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran App - Read the Holy Quran",
    description: "A modern, beautiful, and ad-free Quran reading experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quran App",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${scheherazade.variable} scrollbar-hide`}>
      <body
        className={`
          font-english text-gray-100 min-h-screen flex flex-col
          antialiased
        `}
      >
        <SettingsProvider>
          <BookmarkProvider>
            <ReadingNavProvider>
              <CommandPalette />
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </ReadingNavProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

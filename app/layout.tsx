import Sidebar from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Scheherazade_New } from "next/font/google";

const Scheherazade = Scheherazade_New({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-Scheherazade_New",
});
export const metadata: Metadata = {
  title: "QuranApp",
  description: "Quran app from Nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={` ${Scheherazade.className} bg-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

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
  description: "Quran app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body
        className={` ${Scheherazade.className} bg-gradient-to-b from-gray-900 to-gray-950 `}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

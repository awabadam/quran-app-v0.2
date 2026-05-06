import "../globals.css";
import type { Metadata, Viewport } from "next";
import Navbar, { ReadingNavProvider } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scheherazade_New, Inter } from "next/font/google";
import { SettingsProvider } from "@/context/SettingsContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { ReadingProgressProvider } from "@/context/ReadingProgressContext";
import CommandPalette from "@/components/CommandPalette";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale, getTranslations } from "next-intl/server";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    keywords: ["Quran", "Holy Quran", "Islamic", "Muslim", "Arabic", "Athkar", "Quran App"],
    authors: [{ name: "Awab Elkhalil", url: "https://awab.design" }],
    creator: "Awab Elkhalil",
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : "en_US",
      url: "https://quran.awab.design",
      siteName: t("siteName"),
      title: t("title"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/icon.svg",
      apple: "/icons/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: t("siteName"),
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#10b981",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${scheherazade.variable} scrollbar-hide`}>
      <body
        className={`
          font-english text-gray-100 min-h-screen flex flex-col
          antialiased
        `}
      >
        <NextIntlClientProvider>
          <SettingsProvider>
            <ReadingProgressProvider>
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
            </ReadingProgressProvider>
          </SettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

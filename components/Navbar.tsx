"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/context/SettingsContext";
import { surahs } from "@/lib/surahs";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import InstallPWA from "@/components/InstallPWA";

// Context so SideMenu and SettingsDrawer can be opened from the navbar
export const ReadingNavContext = createContext<{
  sideMenuOpen: boolean;
  setSideMenuOpen: (v: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
} | null>(null);

export function useReadingNav() {
  return useContext(ReadingNavContext);
}

export function ReadingNavProvider({ children }: { children: React.ReactNode }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <ReadingNavContext.Provider value={{ sideMenuOpen, setSideMenuOpen, settingsOpen, setSettingsOpen }}>
      {children}
    </ReadingNavContext.Provider>
  );
}

export default function Navbar() {
  const { setIsSearchOpen } = useSettings();
  const pathname = usePathname();
  const readingNav = useReadingNav();
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');

  // Detect if we're on a surah reading page
  const isSurahPage = /^\/\d+$/.test(pathname);
  const currentSurah = useMemo(() => {
    if (!isSurahPage) return null;
    const id = parseInt(pathname.slice(1));
    return surahs.find(s => s.id === id) || null;
  }, [isSurahPage, pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t('home'), icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: "/bookmarks", label: t('bookmarks'), icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    )},
    { href: "/athkar", label: t('athkar'), icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
    { href: "/about", label: t('about'), icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${scrolled || isSurahPage
            ? "bg-[hsl(240,6%,7%)]/90 backdrop-blur-2xl border-b border-white/[0.04]"
            : "bg-transparent"
          }
        `}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center
                  group-hover:bg-emerald-400 transition-colors duration-300">
                  <span className="text-gray-950 font-bold font-english text-sm">Q</span>
                </div>
                {!currentSurah && (
                  <span className="hidden md:block text-white/90 font-english font-medium text-sm tracking-tight">
                    {t('appName')}
                  </span>
                )}
              </Link>
              {currentSurah && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">/</span>
                  <span dir="rtl" className="font-Scheherazade_New text-base text-gray-200">
                    {currentSurah.arabic}
                  </span>
                  <span className="hidden sm:inline text-xs text-gray-500 font-english">
                    {currentSurah.name}
                  </span>
                </div>
              )}
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-1.5 rounded-full font-english text-[13px]
                    transition-all duration-200
                    ${isActive(link.href)
                      ? "text-white font-medium"
                      : "text-gray-500 hover:text-gray-300"
                    }
                  `}
                >
                  {isActive(link.href) && (
                    <span className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.06]" />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <InstallPWA />
              <LanguageSwitcher />
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-white/[0.03] hover:bg-white/[0.06]
                  border border-white/[0.04] hover:border-white/[0.08]
                  text-gray-500 hover:text-gray-300
                  transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline text-[13px] font-english">{t('search')}</span>
                <kbd className="hidden md:inline text-[10px] text-gray-600 font-english ml-1">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[hsl(240,6%,7%)]/95 backdrop-blur-2xl border-t border-white/[0.04]
        px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {isSurahPage && readingNav ? (
            <>
              <button
                onClick={() => readingNav.setSettingsOpen(true)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-300 active:text-emerald-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="text-[11px] font-english">{t('settings')}</span>
              </button>

              <Link
                href="/"
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-300 active:text-emerald-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[11px] font-english">{t('home')}</span>
              </Link>

              <button
                onClick={() => readingNav.setSideMenuOpen(true)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-300 active:text-emerald-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <span className="text-[11px] font-english">{t('index')}</span>
              </button>
            </>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                  transition-all duration-200
                  ${isActive(link.href) ? "text-emerald-400" : "text-gray-300"}
                `}
              >
                {link.icon}
                <span className="text-[11px] font-english">{link.label}</span>
              </Link>
            ))
          )}
        </div>
      </nav>
    </>
  );
}

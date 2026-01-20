"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar() {
  const { setIsSearchOpen } = useSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: "/athkar", label: "Athkar", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
    { href: "/about", label: "About", icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled 
          ? "bg-gray-950/90 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center
              group-hover:bg-emerald-400 transition-colors duration-300">
              <span className="text-gray-950 font-bold font-english text-lg">Q</span>
            </div>
            <span className="hidden md:block text-white font-english font-semibold text-lg
              group-hover:text-emerald-400 transition-colors">
              Quran App
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-1.5 border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-english text-sm
                  transition-all duration-200
                  ${isActive(link.href)
                    ? "bg-emerald-500 text-gray-950 font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Search */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-gray-800/50 hover:bg-gray-800 
                border border-white/5 hover:border-emerald-500/30
                text-gray-400 hover:text-white
                transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline text-sm font-english">Search</span>
              <kbd className="hidden md:inline text-[10px] text-gray-500 bg-gray-900 rounded px-1.5 py-0.5 ml-2">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 
            bg-gray-950/95 backdrop-blur-xl border-t border-white/5 
            px-2 py-2 safe-area-bottom">
            <div className="flex items-center justify-around">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                    transition-all duration-200
                    ${isActive(link.href)
                      ? "text-emerald-400"
                      : "text-gray-500"
                    }
                  `}
                >
                  {link.icon}
                  <span className="text-[10px] font-english">{link.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

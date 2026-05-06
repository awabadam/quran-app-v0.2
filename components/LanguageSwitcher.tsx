"use client";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "عربي", short: "عربي" },
  { code: "tr", label: "Türkçe", short: "TR" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  function handleSwitch(targetLocale: string) {
    setOpen(false);
    if (targetLocale !== locale) {
      router.replace(pathname, { locale: targetLocale });
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-white/[0.03] hover:bg-white/[0.06]
          border border-white/[0.04] hover:border-white/[0.08]
          text-gray-500 hover:text-gray-300
          transition-all duration-200 text-[13px] font-english"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253"
          />
        </svg>
        <span>{current.short}</span>
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[120px]
          bg-gray-900 border border-white/[0.08] rounded-lg shadow-xl
          overflow-hidden backdrop-blur-sm"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSwitch(l.code)}
              className={`w-full px-3 py-2 text-left text-[13px] transition-colors
                ${l.code === locale
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

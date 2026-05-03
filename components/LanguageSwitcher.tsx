"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "عربي" : "EN";

  function handleSwitch() {
    router.replace(pathname, { locale: targetLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
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
      <span>{label}</span>
    </button>
  );
}

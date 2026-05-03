"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  const featuredSurahs = [
    { id: 1, name: "Al-Fatihah" },
    { id: 36, name: "Ya-Sin" },
    { id: 55, name: "Ar-Rahman" },
    { id: 67, name: "Al-Mulk" },
    { id: 112, name: "Al-Ikhlas" },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/[0.04] hidden md:block">
      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-gray-950 font-bold font-english text-xs">Q</span>
              </div>
              <span className="text-white/80 font-english font-medium text-sm">{t('appName')}</span>
            </Link>
            <p className="text-gray-600 text-sm font-english leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
          </div>

          {/* Featured Surahs */}
          <div>
            <h3 className="text-gray-500 font-english font-medium mb-4 text-xs uppercase tracking-wider">
              {t('featured')}
            </h3>
            <ul className="space-y-2">
              {featuredSurahs.map((surah) => (
                <li key={surah.id}>
                  <Link
                    href={`/${surah.id}`}
                    className="text-gray-600 hover:text-gray-300 transition-colors text-sm font-english flex items-center gap-2"
                  >
                    <span className="text-gray-700 w-4 text-right text-xs">{surah.id}</span>
                    {surah.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h3 className="text-gray-500 font-english font-medium mb-4 text-xs uppercase tracking-wider">
              {t('developer')}
            </h3>
            <Link
              href="https://awab.design"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.06]
                flex items-center justify-center text-gray-400 font-english font-medium text-xs
                group-hover:border-emerald-500/20 transition-colors">
                AE
              </div>
              <div>
                <p className="text-gray-400 font-english text-sm group-hover:text-white transition-colors">
                  Awab Elkhalil
                </p>
                <p className="text-gray-700 font-english text-xs">awab.design</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-700 text-xs font-english">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-gray-700 text-xs font-english">
            {t('dataFrom')}{" "}
            <Link href="https://quran.com" target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-400 transition-colors">
              {t('quranApi')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

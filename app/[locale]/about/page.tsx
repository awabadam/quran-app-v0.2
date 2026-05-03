"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-2xl md:text-3xl font-semibold font-english text-white mb-3">
            {t('title')}
          </h1>
          <p className="text-gray-500 font-english leading-relaxed">
            {t('tagline')}
          </p>
        </div>

        <div className="space-y-14">

          {/* What is it */}
          <section>
            <h2 className="text-sm font-medium font-english text-gray-400 uppercase tracking-wider mb-4">
              {t('whatIsThis')}
            </h2>
            <p className="text-gray-400 font-english leading-relaxed">
              {t('whatIsThisText')}
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-sm font-medium font-english text-gray-400 uppercase tracking-wider mb-4">
              {t('features')}
            </h2>
            <div className="space-y-3">
              {([t('feature1'), t('feature2'), t('feature3'), t('feature4'), t('feature5')] as string[]).map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-400 font-english text-sm">
                  <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-2 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Developer */}
          <section>
            <h2 className="text-sm font-medium font-english text-gray-400 uppercase tracking-wider mb-4">
              {t('madeBy')}
            </h2>
            <Link
              href="https://awab.design"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-2xl
                bg-white/[0.02] border border-white/[0.05]
                hover:border-emerald-500/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500
                flex items-center justify-center text-sm font-bold text-gray-950 font-english
                group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                AE
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium font-english text-white
                  group-hover:text-emerald-400 transition-colors duration-300 mb-0.5">
                  Awab Elkhalil
                </h3>
                <p className="text-gray-600 font-english text-xs">
                  {t('role')}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-700 group-hover:text-emerald-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </section>

          {/* What's New */}
          <section>
            <h2 className="text-sm font-medium font-english text-gray-400 uppercase tracking-wider mb-4">
              {t('whatsNew')}
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-english text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {t('version')}
                  </span>
                  <span className="text-[11px] text-gray-600 font-english">{t('versionDate')}</span>
                </div>
                <ul className="space-y-1.5">
                  {([t('update1'), t('update2'), t('update3'), t('update4'), t('update5'), t('update6')] as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 font-english text-sm">
                      <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Credits */}
          <section>
            <h2 className="text-sm font-medium font-english text-gray-400 uppercase tracking-wider mb-4">
              {t('credits')}
            </h2>
            <div className="space-y-2 text-gray-500 font-english text-sm">
              <p>
                {t('quranData')}{" "}
                <Link href="https://quran.com" target="_blank" rel="noopener noreferrer"
                  className="text-emerald-500/80 hover:text-emerald-400 transition-colors">
                  {t('quranApi')}
                </Link>
              </p>
              <p>
                {t('athkarSource')} <span className="text-gray-600">{t('hisnAlMuslim')}</span>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-6 border-t border-white/[0.04]">
          <p className="text-gray-700 text-xs font-english">
            &copy; {new Date().getFullYear()} Quran App
          </p>
        </div>
      </div>
    </main>
  );
}

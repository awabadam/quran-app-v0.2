"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-20 py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-400 font-english">Q</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold font-english text-white mb-3">
            About
          </h1>
          <p className="text-gray-500 font-english text-lg max-w-md mx-auto">
            A minimal, ad-free Quran reading experience designed for focus and reflection.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 mb-16">
          
          {/* What is it */}
          <section>
            <h2 className="text-xl font-semibold font-english text-white mb-4">
              What is this?
            </h2>
            <p className="text-gray-400 font-english leading-relaxed">
              Quran App is a clean, distraction-free platform for reading the Holy Quran. 
              Built with simplicity in mind, it offers a focused reading experience without 
              ads, popups, or unnecessary features.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold font-english text-white mb-4">
              Features
            </h2>
            <ul className="space-y-3 text-gray-400 font-english">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Complete Quran with 114 surahs in Uthmani script</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Daily Athkar (Morning, Evening, and Sleep supplications)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Page break indicators for traditional reading</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Adjustable font size and reading settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Completely ad-free and open source</span>
              </li>
            </ul>
          </section>

          {/* Developer */}
          <section>
            <h2 className="text-xl font-semibold font-english text-white mb-4">
              Made by
            </h2>
            <Link 
              href="https://awab.design" 
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/40 border border-gray-800/50 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                  flex items-center justify-center text-lg font-bold text-gray-950 font-english
                  group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                  AE
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold font-english text-white 
                    group-hover:text-emerald-400 transition-colors duration-300 mb-1">
                    Awab Elkhalil
                  </h3>
                  <p className="text-gray-500 font-english text-sm">
                    Product Designer & Full-Stack Developer
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </Link>
          </section>

          {/* Credits */}
          <section>
            <h2 className="text-xl font-semibold font-english text-white mb-4">
              Credits
            </h2>
            <div className="space-y-3 text-gray-400 font-english">
              <p>
                Quran data provided by{" "}
                <Link 
                  href="https://quran.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Quran.com API
                </Link>
              </p>
              <p>
                Athkar sourced from{" "}
                <span className="text-gray-500">Hisn al-Muslim (حصن المسلم)</span>
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-800/50">
          <p className="text-gray-600 text-sm font-english">
            © {new Date().getFullYear()} Quran App
          </p>
        </div>
      </div>
    </main>
  );
}

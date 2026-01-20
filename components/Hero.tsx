"use client";
import { useEffect, useState } from "react";
import ContinueReading from "./ContinueReading";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span dir="rtl" className="font-Scheherazade_New text-[30vw] text-white/[0.02] leading-none">
          قرآن
        </span>
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-english font-semibold text-white mb-3">
          Quran App
        </h1>
        
        <p className="text-gray-500 font-english mb-10">
          Read • Reflect • Remember
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <a 
            href="#surahs" 
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 
              text-gray-950 font-english font-medium rounded-xl
              transition-colors duration-200"
          >
            Browse Surahs
          </a>
          <a 
            href="/athkar" 
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10
              text-gray-300 hover:text-white font-english font-medium rounded-xl
              transition-all duration-200"
          >
            Daily Athkar
          </a>
        </div>

        {/* Continue Reading */}
        <div className="w-full max-w-sm mx-auto">
          <ContinueReading />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <a href="#surahs" className="flex flex-col items-center gap-2 text-gray-600 hover:text-emerald-400 transition-colors">
          <div className="w-5 h-8 border border-current rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-current rounded-full animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}

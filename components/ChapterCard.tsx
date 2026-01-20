"use client";
import Link from "next/link";

export default function ChapterCard({
  id,
  arName,
  enName,
  verses,
  place,
}: any) {
  return (
    <Link
      href={`/${id}`}
      className="group relative flex flex-col w-full rounded-2xl overflow-hidden min-h-[160px] justify-between p-5 btn-press
        bg-gray-900/60 backdrop-blur-sm border border-white/[0.06]
        hover:border-emerald-500/40 hover:bg-gray-800/80
        transition-all duration-500 ease-smooth
        hover:shadow-glow hover:-translate-y-1"
    >
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id={`pattern-${id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M10 0L20 10L10 20L0 10Z" 
                fill="none" 
                stroke="rgba(16, 185, 129, 0.1)" 
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill={`url(#pattern-${id})`} />
        </svg>
      </div>
      
      {/* Gradient Glow Effect */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 50%, rgba(212, 175, 55, 0.05) 100%)',
        }}
      />

      {/* Background Number */}
      <div className="absolute -bottom-6 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110 origin-bottom-right">
        <span className="text-[8rem] font-bold text-emerald-400 font-english select-none">{id}</span>
      </div>
      
      {/* Top Row: ID & Metadata */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 font-english
            group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300">
            {id}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-english text-gray-200 group-hover:text-emerald-400 transition-colors duration-300">
              {enName}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-english">
              {verses} verses • {place === 'makkah' ? 'Meccan' : 'Medinan'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Arabic Name */}
      <div className="flex justify-end items-end relative z-10 mt-4">
        <span dir="rtl" className="font-Scheherazade_New text-2xl text-gray-300 group-hover:text-emerald-400 transition-colors duration-300 leading-none">
          سورة {arName}
        </span>
      </div>
      
      {/* Bottom Border Glow on Hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}

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
      className="group relative flex flex-col w-full rounded-2xl overflow-hidden min-h-[140px] justify-between p-5
        bg-white/[0.02] border border-white/[0.05]
        hover:bg-white/[0.04] hover:border-emerald-500/20
        transition-all duration-400 ease-smooth
        hover:-translate-y-0.5"
    >
      {/* Background number */}
      <div className="absolute -bottom-4 -right-2 pointer-events-none select-none
        opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
        <span className="text-[7rem] font-bold text-white font-english leading-none">{id}</span>
      </div>

      {/* Top: ID + Name */}
      <div className="flex items-start gap-3 relative z-10">
        <span className="w-9 h-9 rounded-lg bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center
          text-xs font-semibold text-emerald-400 font-english flex-shrink-0
          group-hover:bg-emerald-500 group-hover:text-gray-950 group-hover:border-emerald-400
          transition-all duration-300">
          {id}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-english text-gray-200 group-hover:text-white transition-colors duration-300 truncate">
            {enName}
          </span>
          <span className="text-[10px] text-gray-600 uppercase tracking-wider font-english">
            {verses} ayahs &middot; {place === 'makkah' ? 'Meccan' : 'Medinan'}
          </span>
        </div>
      </div>

      {/* Bottom: Arabic name */}
      <div className="flex justify-end items-end relative z-10 mt-3">
        <span dir="rtl" className="font-Scheherazade_New text-xl text-gray-400 group-hover:text-emerald-400/80 transition-colors duration-400 leading-none">
          {arName}
        </span>
      </div>

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}

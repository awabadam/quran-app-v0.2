"use client";

export default function VerseCount({ count }: { count: number }) {
  return (
    <span className="relative inline-flex items-center justify-center mx-1 group">
      {/* Background symbol */}
      <span className="absolute text-4xl text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors duration-300 select-none">
        ۝
      </span>
      {/* Number */}
      <span className="relative text-xs font-english font-bold text-emerald-500/60 group-hover:text-emerald-400 transition-colors duration-300">
        {count}
      </span>
    </span>
  );
}

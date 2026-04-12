import Link from "next/link";

interface JuzCardProps {
  juzNumber: number;
  versesCount: number;
  surahRange: string;
  firstSurahId: number;
  firstVerse: number;
}

export default function JuzCard({ juzNumber, versesCount, surahRange, firstSurahId, firstVerse }: JuzCardProps) {
  return (
    <Link href={`/${firstSurahId}?verse=${firstVerse}`}>
      <div className="group p-4 rounded-2xl
        bg-white/[0.02] border border-white/[0.05]
        hover:bg-white/[0.04] hover:border-emerald-500/20
        transition-all duration-200"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg
            bg-emerald-500/10 text-emerald-400 text-xs font-english font-semibold
            group-hover:bg-emerald-500/20 transition-colors">
            {juzNumber}
          </div>
          <div>
            <p className="text-sm text-gray-200 font-english font-medium group-hover:text-white transition-colors">
              Juz {juzNumber}
            </p>
            <p className="text-xs text-gray-600 font-english">
              {versesCount} verses
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-english truncate">
          {surahRange}
        </p>
      </div>
    </Link>
  );
}

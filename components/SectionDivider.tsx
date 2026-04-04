export default function SectionDivider() {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="relative flex items-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <svg
          className="mx-4 w-8 h-8 text-emerald-500/30"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
        >
          {/* 8-point Islamic star */}
          <polygon points="16,2 19.5,12.5 30,16 19.5,19.5 16,30 12.5,19.5 2,16 12.5,12.5" />
          <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>
    </div>
  );
}

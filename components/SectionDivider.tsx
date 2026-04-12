export default function SectionDivider() {
  return (
    <div className="w-full max-w-xs mx-auto py-8">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header className="flex w-full cursor-default flex-col gap-2 rounded-2xl border border-(--border) bg-(--bg-2) px-6 py-3 md:h-16 md:flex-row md:items-center md:gap-4 md:py-0">
      {/* ردیف اول: لوگو + badge */}
      <div className="flex items-center justify-between md:contents">
        {/* لوگو */}
        <div className="shrink-0 text-lg font-bold text-(--neon)">AI Store</div>
        {/* AI Badge */}
        <div className="flex shrink-0 cursor-default items-center gap-1.5 rounded-full border border-(--neon-border) bg-(--neon-bg) px-3 py-1.5 text-xs text-(--neon)">
          ✨ جستجوی AI
        </div>
      </div>

      {/* سرچ */}
      <div className="relative flex-1 px-0 md:px-4">
        <span className="absolute top-1/2 left-2 -translate-y-1/2 text-(--text-muted) md:left-6">
          🔍
        </span>
        <input
          type="text"
          placeholder="مثلاً: کت مجلسی زیر ۵۰۰ هزار..."
          className="h-10 w-full rounded-xl border border-(--border) bg-(--bg-3) pr-9 pl-4 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--neon-border)"
        />
      </div>
    </header>
  );
}

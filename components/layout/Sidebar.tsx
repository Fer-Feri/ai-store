const chips: string[] = [
  "همه",
  "زیر ۵ میلیون",
  "۵ تا ۱۵ میلیون",
  "بالای 5 میلیون",
];

export default function Sidebar() {
  return (
    <aside className="flex shrink-0 flex-col gap-2 rounded-2xl border border-(--border) bg-(--bg-2) px-4 py-6 md:w-60">
      {/* عنوان */}
      <h2 className="mb-3 border-b border-b-(--border) pb-3 text-[15px] font-bold text-(--text-primary)">
        فیلترها
      </h2>
      {/* لیبل */}
      <div className="flex cursor-default flex-col gap-2">
        <p className="mb-1 text-xs text-(--text-muted)">محدوده قیمت</p>
        {/* چیپ‌ها */}
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              className="cursor-pointer rounded-full border border-(--border-light) bg-(--bg-3) px-3.5 py-2 text-right text-xs text-(--text-primary) transition duration-150"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      {/* دکمه ریست */}
      <button className="mt-4 cursor-pointer rounded-full border border-red-500/30 bg-red-500/5 px-3.5 py-2 text-xs text-red-400">
        پاک کردن فیلتر
      </button>
    </aside>
  );
}

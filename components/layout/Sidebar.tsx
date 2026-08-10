const chips: string[] = [
  "همه",
  "زیر ۵ میلیون",
  "۵ تا ۱۵ میلیون",
  "بالای 15 میلیون",
];
const categoryMap: Record<string, string> = {
  مردانه: "men's clothing",
  زنانه: "women's clothing",
  الکترونیک: "electronics",
  جواهرات: "jewelery",
};

type SidebarProps = {
  selectedCategory: string;
  selectedPrice: string;
  onCategoryChange: (val: string) => void;
  onPriceChange: (val: string) => void;
  onReset: () => void;
};

export default function Sidebar({
  selectedCategory,
  selectedPrice,
  onCategoryChange,
  onPriceChange,
  onReset,
}: SidebarProps) {
  return (
    <aside className="flex shrink-0 flex-col gap-2 rounded-2xl border border-(--border) bg-(--bg-2) px-4 py-6 md:w-60">
      {/* عنوان */}
      <h2 className="mb-3 border-b border-b-(--border) pb-3 text-[15px] font-bold text-(--text-primary)">
        فیلترها
      </h2>
      {/* دسته بندی ها */}
      <div className="mb-4 flex cursor-default flex-col gap-2">
        <p className="mb-1 text-xs text-(--text-muted)">دسته بندی‌ها</p>
        {/* چیپ‌ها */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryMap).map(([persian, english]) => (
            <button
              onClick={() =>
                // اگه همین دسته انتخابه → deselect، وگرنه → select
                onCategoryChange(selectedCategory === english ? "" : english)
              }
              key={english}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs transition duration-150${
                selectedCategory === english
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-(--border-light) bg-(--bg-3) text-(--text-primary)"
              }`}
            >
              {persian}
            </button>
          ))}
        </div>
      </div>
      {/* قیمت ها */}
      <div className="flex cursor-default flex-col gap-2">
        <p className="mb-1 text-xs text-(--text-muted)">محدوده قیمت</p>
        {/* چیپ‌ها */}
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => onPriceChange(chip)}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs transition duration-150 ${
                selectedPrice === chip
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-(--border-light) bg-(--bg-3) text-(--text-primary)"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      {/* دکمه ریست */}
      <button
        onClick={() => onReset()}
        className="mt-4 cursor-pointer rounded-full border border-red-500/30 bg-red-500/5 px-3.5 py-2 text-xs text-red-400"
      >
        پاک کردن فیلتر
      </button>
    </aside>
  );
}

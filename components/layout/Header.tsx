"use client";
import { useState } from "react";

type HeaderProps = {
  onSearch: (query: string) => void;
};

export default function Header({ onSearch }: HeaderProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  // دکمه جستجو
  const handleSearchKey = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

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
        <button
          onKeyDown={(event) => event.key === "Enter" && handleSearchKey()}
          className="absolute top-1/2 left-1 -translate-y-1/2 rounded-lg border border-(--neon-border) bg-(--neon-bg) px-3 py-1 text-xs text-(--neon) transition-all hover:bg-(--neon) hover:text-black disabled:cursor-not-allowed disabled:opacity-30 md:left-5"
        >
          جستجو
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="مثلاً: لباس مردانه زیر 5 میلیون..."
          className="h-10 w-full rounded-xl border border-(--border) bg-(--bg-3) pr-9 pl-4 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--neon-border)"
        />
      </div>
    </header>
  );
}

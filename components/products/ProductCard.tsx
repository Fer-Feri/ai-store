import { Product } from "@/types";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg-2) transition-all duration-300 hover:border-(--neon-border) hover:shadow-[0_0_20px_var(--neon-bg)]">
      {/* Image */}
      <div className="relative flex h-48 w-full items-center justify-center bg-(--bg-3) p-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        <span className="self-start rounded-full border border-(--neon-border) bg-(--neon-bg) px-2 py-0.5 text-xs text-(--neon) capitalize">
          {product.category}
        </span>
        {/* Title */}
        <h3 className="line-clamp-2 text-sm leading-relaxed font-medium text-(--text-primary)">
          {product.title}
        </h3>
        {/* Footer: price + button */}
        <div className="mt-auto flex flex-wrap items-center justify-between border-t border-(--border) pt-3">
          <span className="flex items-center text-base font-bold text-(--neon-bright)">
            {product.price}
            <span className="text-xs">$</span>
          </span>
          <button className="rounded-lg border border-(--neon-border) bg-(--neon-bg) px-3 py-1.5 text-xs text-(--neon) transition-all duration-200 hover:bg-(--neon) hover:text-(--bg)">
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}

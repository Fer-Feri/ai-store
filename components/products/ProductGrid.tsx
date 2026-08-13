import { Product } from "@/types";
import ProductCard from "./ProductCard";

type ProductsGridProps = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  canShowLess: boolean;
  onLoadMore: () => void;
  onLoadLess: () => void;
  isEmpty: boolean;
};

export default function ProductGrid({
  products,
  filteredProducts,
  loading,
  error,
  hasMore,
  canShowLess,
  onLoadMore,
  onLoadLess,
  isEmpty,
}: ProductsGridProps) {
  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-gray-200"
            ></div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-6">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      {/* ───  پیام پیدا نکردن محصول ai ─── */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          {/* آیکون ذره‌بین */}
          <svg
            className="h-16 w-16 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <h3 className="text-lg font-semibold text-neutral-700">
            محصولی مطابق با خواسته شما پیدا نشد 🙁
          </h3>

          <p className="max-w-md text-sm text-neutral-500">
            عبارت جستجو را تغییر دهید یا دسته‌بندی دیگری را امتحان کنید.
          </p>
        </div>
      )}

      {/* ─── ۲) گرید محصولات (فقط اگر محصولی هست) ─── */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ─── ۳) دکمه‌های صفحه‌بندی (در حالت خالی نمایش داده نشوند) ─── */}
      <div className="flex items-center justify-center gap-3">
        {!isEmpty && hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onLoadMore}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}

        {!isEmpty && canShowLess && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onLoadLess}
              className="rounded-xl bg-red-600 px-6 py-2 text-white transition-all hover:bg-red-700"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
      {/* ─── ۳) دکمه‌های صفحه‌بندی (در حالت خالی نمایش داده نشوند) ─── */}
    </main>
  );
}

import { Product } from "@/types";
import ProductCard from "./ProductCard";

type ProductsGridProps = {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  canShowLess: boolean;
  onLoadMore: () => void;
  onLoadLess: () => void;
};

export default function ProductGrid({
  products,
  loading,
  error,
  hasMore,
  canShowLess,
  onLoadMore,
  onLoadLess,
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onLoadMore}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
        {canShowLess && (
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
    </main>
  );
}

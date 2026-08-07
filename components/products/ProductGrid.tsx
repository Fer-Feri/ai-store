import { Product } from "@/types";
import ProductCard from "./ProductCard";

type ProductsGridProps = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export default function ProductGrid({
  products,
  loading,
  error,
}: ProductsGridProps) {
  if (loading) {
    <main className="flex-1 p-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-gray-200"
          ></div>
        ))}
      </div>
    </main>;
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
    </main>
  );
}

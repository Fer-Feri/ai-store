"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { useCallback, useEffect, useState } from "react";

const LIMIT = 8;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0); // offset → از کجا شروع کنیم؟ اول: 0، بعد: 8، بعد: 16...
  const [hasMore, sethasMore] = useState(true); // hasMore → آیا محصول بیشتری وجود داره؟

  // useCallback → این تابع رو cache میکنه، هر render دوباره ساخته نمیشه
  const fetchProducts = useCallback(async (currentOffset: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://fakestoreapi.com/products?limit=${LIMIT + currentOffset}`,
      );
      if (!response.ok) throw new Error("خطا در دریافت محصولات");

      const data: Product[] = await response.json();

      setProducts(data);
      sethasMore(data.length >= LIMIT + currentOffset); // اگه تعداد برگشتی کمتر از LIMIT بود یعنی دیگه محصولی نداره
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // اولین بار که صفحه لود میشه
  useEffect(() => {
    fetchProducts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset);
  };

  const handleLoadLess = () => {
    if (offset <= 0) return;
    const newOffset = offset - LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset);
  };

  return (
    <main className="flex min-h-screen flex-col gap-4 p-10">
      <Header />
      <div className="mt-2 flex flex-col flex-wrap gap-6 md:flex-row">
        <Sidebar />
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onLoadLess={handleLoadLess}
          canShowLess={offset > 0}
        />
      </div>
    </main>
  );
}

"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const LIMIT = 8;
const TOMAN_RATE = 140000;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0); // offset → از کجا شروع کنیم؟ اول: 0، بعد: 8، بعد: 16...
  const [hasMore, sethasMore] = useState(true); // hasMore → آیا محصول بیشتری وجود داره؟

  const [selectCategory, setSelectCategoty] = useState<string>("");
  const [selectPrice, setSelectPrice] = useState<string>("همه");

  // useCallback → این تابع رو cache میکنه، هر render دوباره ساخته نمیشه
  const fetchProducts = useCallback(
    async (currentOffset: number, category: string = "") => {
      setLoading(true);
      setError(null);

      const url = category
        ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}?limit=${LIMIT}&offset=${currentOffset}`
        : `https://fakestoreapi.com/products?limit=${LIMIT + currentOffset}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("خطا در دریافت محصولات");

        const data: Product[] = await response.json();

        setProducts(data);
        sethasMore(data.length >= LIMIT + currentOffset); // اگه تعداد برگشتی کمتر از LIMIT بود یعنی دیگه محصولی نداره
      } catch (error: unknown) {
        if (error instanceof Error) setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // اولین بار که صفحه لود میشه
  useEffect(() => {
    setOffset(0);
    fetchProducts(0, selectCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCategory]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset, selectCategory);
  };

  const handleLoadLess = () => {
    if (offset <= 0) return;
    const newOffset = offset - LIMIT;
    setOffset(newOffset);
    fetchProducts(newOffset, selectCategory);
  };

  // -----------------------------------------------
  const filteredProducts = useMemo(() => {
    if (selectPrice === "همه") return products;

    const priceInToman = products.map((product) => ({
      ...product,
      toman: product.price * TOMAN_RATE,
    }));
    if (selectPrice === "زیر ۵ میلیون")
      return priceInToman.filter((p) => p.toman < 5_000_000);
    if (selectPrice === "۵ تا ۱۵ میلیون")
      priceInToman.filter((p) => p.toman >= 5_000_000 && p.toman <= 15_000_000);
    return priceInToman.filter((p) => p.toman > 15_000_000);
  }, [products, selectPrice]);

  // -----------------------------------------------

  return (
    <main className="flex min-h-screen flex-col gap-4 p-10">
      <Header />
      <div className="mt-2 flex flex-col flex-wrap gap-6 md:flex-row">
        <Sidebar
          selectedCategory={selectCategory}
          selectedPrice={selectPrice}
          onCategoryChange={(val) => setSelectCategoty(val)}
          onPriceChange={(val) => setSelectPrice(val)}
          onReset={() => {
            setSelectCategoty("");
            setSelectPrice("همه");
            setOffset(0);
          }}
        />
        <ProductGrid
          products={products}
          filteredProducts={filteredProducts}
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

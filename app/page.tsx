"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

const LIMIT = 8;
const TOMAN_RATE = 180_000;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectPrice, setSelectPrice] = useState("همه");

  // آیا نتایج فعلی از جستجوی هوشمند آمده‌اند؟
  const [isAiSearch, setIsAiSearch] = useState(false);

  /**
   * دریافت محصولات عادی از Fake Store API
   */
  const fetchProducts = useCallback(
    async (currentOffset: number, category: string = "") => {
      setLoading(true);
      setError(null);

      const url = category
        ? `https://fakestoreapi.com/products/category/${encodeURIComponent(
            category,
          )}?limit=${LIMIT}&offset=${currentOffset}`
        : `https://fakestoreapi.com/products?limit=${LIMIT + currentOffset}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("خطا در دریافت محصولات");
        }

        const data: Product[] = await response.json();

        setOffset(currentOffset);
        setProducts(data);

        /**
         * در حالت عادی، اگر تعداد محصولات دریافتی
         * به اندازه صفحه فعلی باشد، احتمالاً محصول بیشتری وجود دارد.
         */
        setHasMore(data.length >= LIMIT + currentOffset);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "خطای ناشناخته در دریافت محصولات",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * بارگذاری اولیه و تغییر دسته‌بندی
   *
   * اگر در حالت AI باشیم، نباید نتایج AI با محصولات عادی
   * جایگزین شوند.
   */
  useEffect(() => {
    if (isAiSearch) return;

    void (async () => {
      await fetchProducts(0, selectCategory);
    })();
  }, [selectCategory, isAiSearch, fetchProducts]);

  /**
   * بارگذاری محصولات بیشتر در حالت عادی
   */
  const handleLoadMore = () => {
    if (isAiSearch || !hasMore || loading) return;

    const newOffset = offset + LIMIT;

    fetchProducts(newOffset, selectCategory);
  };

  /**
   * برگشت به صفحه قبلی در حالت عادی
   */
  const handleLoadLess = () => {
    if (isAiSearch || offset <= 0 || loading) return;

    const newOffset = offset - LIMIT;

    fetchProducts(newOffset, selectCategory);
  };

  /**
   * اعمال فیلتر قیمت سمت کلاینت
   */
  const filteredProducts = useMemo(() => {
    if (selectPrice === "همه") {
      return products;
    }

    const productsWithTomanPrice = products.map((product) => ({
      ...product,
      toman: product.price * TOMAN_RATE,
    }));

    if (selectPrice === "زیر ۵ میلیون") {
      return productsWithTomanPrice.filter(
        (product) => product.toman < 5_000_000,
      );
    }

    if (selectPrice === "۵ تا ۱۵ میلیون") {
      return productsWithTomanPrice.filter(
        (product) => product.toman >= 5_000_000 && product.toman <= 15_000_000,
      );
    }

    return productsWithTomanPrice.filter(
      (product) => product.toman > 15_000_000,
    );
  }, [products, selectPrice]);

  /**
   * جستجوی هوشمند با API داخلی
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const serverError =
          payload && typeof payload === "object" && "error" in payload
            ? (payload as { error?: unknown }).error
            : null;

        throw new Error(
          typeof serverError === "string"
            ? serverError
            : "خطا در جستجوی هوشمند",
        );
      }

      const data = payload as {
        intent: {
          category: string | null;
          keyword: string | null;
          maxPrice: number | null;
        };
        results: Product[];
      };

      /**
       * اول حالت AI را فعال می‌کنیم تا useEffect
       * نتایج را دوباره از Fake Store API نگیرد.
       */
      setIsAiSearch(true);

      setProducts(data.results);
      setOffset(0);

      // نتایج AI صفحه‌بندی ندارند
      setHasMore(false);

      // فیلترهای قبلی Sidebar روی نتایج AI اعمال نشوند
      setSelectCategory("");
      setSelectPrice("همه");

      console.log("🔎 Search intent:", data.intent);
      console.log("📦 AI results:", data.results);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "خطای ناشناخته در جستجوی هوشمند",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * تغییر دسته‌بندی Sidebar
   */
  const handleCategoryChange = (value: string) => {
    // با انتخاب دسته‌بندی، از حالت AI خارج می‌شویم
    setIsAiSearch(false);
    setSelectCategory(value);
    setSelectPrice("همه");
  };

  /**
   * Reset کامل صفحه
   */
  const handleReset = () => {
    // تغییر این مقدار باعث می‌شود useEffect دوباره محصولات عادی را بگیرد
    setIsAiSearch(false);

    setSelectCategory("");
    setSelectPrice("همه");
    setOffset(0);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col gap-4 p-10">
      <Header onSearch={handleSearch} />

      <div className="mt-2 flex flex-col flex-wrap gap-6 md:flex-row">
        <Sidebar
          selectedCategory={selectCategory}
          selectedPrice={selectPrice}
          onCategoryChange={handleCategoryChange}
          onPriceChange={(value) => setSelectPrice(value)}
          onReset={handleReset}
        />

        <ProductGrid
          products={products}
          filteredProducts={filteredProducts}
          loading={loading}
          error={error}
          hasMore={!isAiSearch && hasMore}
          onLoadMore={handleLoadMore}
          onLoadLess={handleLoadLess}
          canShowLess={!isAiSearch && offset > 0}
          isEmpty={
            (isAiSearch && products.length === 0) ||
            filteredProducts.length === 0
          }
        />
      </div>
    </main>
  );
}

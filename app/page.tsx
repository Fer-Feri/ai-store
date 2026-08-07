"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("خطا در دریافت محصولات");
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        setError("محصولات بارگذاری نشدند. دوباره تلاش کنید");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  return (
    <main className="flex min-h-screen flex-col gap-4 p-10">
      <Header />
      <div className="mt-2 flex flex-col flex-wrap gap-6 md:flex-row">
        <Sidebar />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </main>
  );
}

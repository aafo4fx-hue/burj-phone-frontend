"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";

// Previously: fetched ALL products, filtered in browser.
// Now: sends ?category= to backend — MongoDB filters directly.
export default function GamesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent("اكسسورات")}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <CategoryLayout title="اكسسورات" parentLabel="اكسسورات" products={products} loading={loading} emptyIcon="🕹️" />;
}

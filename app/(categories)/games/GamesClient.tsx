"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";

export default function GamesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.category === "اكسسورات"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <CategoryLayout title="اكسسورات" parentLabel="اكسسورات" products={products} loading={loading} emptyIcon="🕹️" />;
}

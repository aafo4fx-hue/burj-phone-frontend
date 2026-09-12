"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";

const PS_CATEGORIES = ["ps5", "ps4", "xbox", "controller", "gaming-accessories", "بلاي ستيشن"];

export default function PlaystationClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => PS_CATEGORIES.includes(p.category ?? "")));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return <CategoryLayout title="أجهزة بلاي ستيشن" parentLabel="أجهزة بلاي ستيشن" products={products} loading={loading} emptyIcon="🎮" />;
}

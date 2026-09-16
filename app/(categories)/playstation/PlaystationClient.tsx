"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";

// Previously: fetched ALL products, filtered in browser.
// Now: sends each PS category to backend — MongoDB filters, only matching
// products returned. Eliminates full-catalog download.
const PS_CATEGORIES = ["ps5", "ps4", "xbox", "controller", "gaming-accessories", "بلاي ستيشن"];

export default function PlaystationClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      PS_CATEGORIES.map((cat) =>
        fetch(`/api/products?category=${encodeURIComponent(cat)}`)
          .then((r) => r.json())
          .catch(() => [] as Product[])
      )
    )
      .then((results) => {
        const seen = new Set<string>();
        const merged: Product[] = [];
        for (const arr of results) {
          if (Array.isArray(arr)) {
            for (const p of arr) {
              if (!seen.has(p._id)) {
                seen.add(p._id);
                merged.push(p);
              }
            }
          }
        }
        setProducts(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryLayout
      title="أجهزة بلاي ستيشن"
      parentLabel="أجهزة بلاي ستيشن"
      products={products}
      loading={loading}
      emptyIcon="🎮"
    />
  );
}

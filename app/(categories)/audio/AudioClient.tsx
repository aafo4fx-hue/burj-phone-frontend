"use client";

import { useEffect, useState } from "react";
import CategoryLayout from "../../components/products/CategoryLayout";
import type { Product } from "../../components/products/types";

// Previously: fetched ALL products, filtered in browser.
// Now: sends category params to backend — MongoDB filters by category,
// only matching products are returned. Eliminates full-catalog download.
const AUDIO_CATEGORIES = ["سماعات ابل", "speaker", "earbuds"];

export default function AudioClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch each category in parallel, then merge results.
    Promise.all(
      AUDIO_CATEGORIES.map((cat) =>
        fetch(`/api/products?category=${encodeURIComponent(cat)}`)
          .then((r) => r.json())
          .catch(() => [] as Product[])
      )
    )
      .then((results) => {
        // Deduplicate by _id in case any product matches multiple categories.
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryLayout
      title="أجهزة صوت و سماعات"
      parentLabel="أجهزة صوت و سماعات"
      products={products}
      loading={loading}
      emptyIcon="🎧"
    />
  );
}

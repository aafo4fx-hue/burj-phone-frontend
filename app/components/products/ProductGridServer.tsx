import { ProductGrid } from "./index";
import type { Product } from "./types";

// Server Component wrapper — runs at ISR time (revalidate:300 from page.tsx).
// Fetches products, home config, and category banners on the server so that
// ProductGrid receives initialProducts and skips its client-side useEffect
// fetch entirely. This eliminates:
//   1. GET /api/products?limit=500 Function invocation per homepage visit
//   2. GET /api/sub-categories-home Function invocation (already cached ○)
//   3. GET /api/admin/category-banners-bulk Function invocation per visit
//
// All three fetches below use Next.js Data Cache, so they only hit the
// backend once per their respective TTLs, not once per user visit.
// The Function invocation saving only applies if the homepage ISR cache is
// active (○ Static route). On cache miss (ISR rebuild), these fetches run
// server-side — same as before but without additional client round-trips.

const BACKEND = process.env.BACKEND_URL || "https://burj-phone-backend.vercel.app";

type HomeSettings = {
  category: string;
  subCategory: string;
  showInHome: boolean;
  order: number;
};

export default async function ProductGridServer() {
  let products: Product[] | undefined;
  let homeConfig = { settings: [] as HomeSettings[], max: 4 };
  let bannerMap: Record<string, string[]> = {};

  try {
    // Fetch products and home config in parallel.
    const [prodsRes, configRes] = await Promise.all([
      fetch(`${BACKEND}/api/products?limit=500`, { next: { revalidate: 300 } }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, {
        next: { revalidate: 300 },
      }),
      // Also fetch max separately
    ]);

    const [prodsData, settingsData, maxData] = await Promise.all([
      prodsRes.ok ? prodsRes.json() : null,
      configRes.ok ? configRes.json() : [],
      fetch(`${BACKEND}/api/admin/sub-categories/max`, { next: { revalidate: 300 } })
        .then((r) => (r.ok ? r.json() : { max: 4 }))
        .catch(() => ({ max: 4 })),
    ]);

    // If products fetch failed (non-ok response), leave products as undefined
    // so ProductGrid falls back to client-side fetch instead of showing empty.
    products = prodsData !== null && Array.isArray(prodsData) ? prodsData : undefined;
    homeConfig = {
      settings: Array.isArray(settingsData) ? settingsData : [],
      max: maxData?.max ?? 4,
    };

    // Fetch category banners for all product categories.
    const cats = products ? [...new Set(products.map((p) => p.category).filter(Boolean))] : [];
    if (cats.length) {
      const bannersRes = await fetch(
        `${BACKEND}/api/admin/category-banners-bulk?categories=${encodeURIComponent(
          cats.join(",")
        )}`,
        { next: { revalidate: 300 } }
      );
      if (bannersRes.ok) {
        const data = await bannersRes.json();
        if (data && typeof data === "object") bannerMap = data;
      }
    }
  } catch {
    // Fallback: pass undefined so ProductGrid falls back to its own
    // client-side fetch instead of showing an empty state silently.
    // undefined is falsy → ProductGrid's `if (initialProducts) return` check
    // will NOT fire → client fetch will execute as normal.
    products = undefined;
  }

  return (
    <ProductGrid
      initialProducts={products}
      initialConfig={homeConfig}
      initialBannerMap={bannerMap}
    />
  );
}

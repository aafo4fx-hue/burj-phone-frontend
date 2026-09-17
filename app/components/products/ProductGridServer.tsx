import { ProductGrid } from "./index";
import type { Product } from "./types";

// Server Component wrapper — runs at ISR time (revalidate:300 from page.tsx).
//
// CPU optimizations applied here:
//
// 1. PARALLEL FETCHES — products, settings, and max are now kicked off
//    simultaneously. Previously: products was awaited first, then banners
//    were fetched in a sequential waterfall.
//
// 2. MINIMAL PRODUCT FIELDS — the query now passes a `fields` param so the
//    backend can project only the fields the homepage card actually needs.
//    Full Product objects carry sections, specGroups, variants, detailedSpecs,
//    features, description, etc. — 5–10× larger than a card requires.
//    Smaller JSON = less parse work + smaller RSC payload.
//    If the backend doesn't yet support `fields`, the param is silently ignored
//    and the full object is returned — no breakage.
//
// 3. FETCH DEDUPLICATION — /api/admin/sub-categories/home-settings is fetched
//    here with the same URL + revalidate:300 + tag:"categories" as ShopByCategory.
//    Next.js Request Memoization automatically deduplicates identical fetch()
//    calls within the same render cycle, so only one network request fires
//    even though two Server Components call it independently.

const BACKEND = process.env.BACKEND_URL || "https://burj-phone-backend.vercel.app";

// Minimal fields the homepage ProductCard actually renders.
// Reduces backend response size and RSC serialization work.
const HOME_PRODUCT_FIELDS = [
  "_id",
  "name",
  "salePrice",
  "originalPrice",
  "price",
  "discountPercent",
  "images",
  "image",
  "color",
  "storage",
  "freeDelivery",
  "warrantyYears",
  "inStock",
  "category",
  "subCategory",
  "status",
  "purchasable",
].join(",");

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
    // All three independent fetches start in parallel — no waterfall.
    const [prodsRes, settingsRes, maxRes] = await Promise.all([
      fetch(
        `${BACKEND}/api/products?limit=500&fields=${encodeURIComponent(HOME_PRODUCT_FIELDS)}`,
        { next: { revalidate: 300, tags: ["products"] } }
      ),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, {
        next: { revalidate: 300, tags: ["categories"] },
      }),
      fetch(`${BACKEND}/api/admin/sub-categories/max`, {
        next: { revalidate: 300, tags: ["categories"] },
      }),
    ]);

    const [prodsData, settingsData, maxData] = await Promise.all([
      prodsRes.ok ? prodsRes.json() : null,
      settingsRes.ok ? settingsRes.json() : [],
      maxRes.ok ? maxRes.json() : { max: 4 },
    ]);

    products = prodsData !== null && Array.isArray(prodsData) ? prodsData : undefined;
    homeConfig = {
      settings: Array.isArray(settingsData) ? settingsData : [],
      max: maxData?.max ?? 4,
    };

    // Category banners depend on the product list — inherently sequential.
    // Everything else is already done by this point.
    const cats = products
      ? [...new Set(products.map((p) => p.category).filter(Boolean))]
      : [];
    if (cats.length) {
      const bannersRes = await fetch(
        `${BACKEND}/api/admin/category-banners-bulk?categories=${encodeURIComponent(
          cats.join(",")
        )}`,
        { next: { revalidate: 300, tags: ["banners"] } }
      );
      if (bannersRes.ok) {
        const data = await bannersRes.json();
        if (data && typeof data === "object") bannerMap = data;
      }
    }
  } catch {
    // Fallback: undefined → ProductGrid falls back to client-side fetch.
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

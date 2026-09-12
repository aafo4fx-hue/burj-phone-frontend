"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./types";
import CategoryBanner from "../banner/CategoryBanner";

const LIMIT = 4;

const categoryPageMap: Record<string, string> = {
  smartphone: "/smartphones/apple-only",
  smartphones: "/smartphones/apple-only",
  watch: "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "ابل ايفون 14 بلس": "/smartphones/iphone-14-plus",
  "ابل ايفون 13 برو ماكس": "/smartphones/iphone-13-pro-max",
  "سامسونج جالكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي اس 26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S25 الترا": "/smartphones/samsung-s25-ultra",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

function parseStorage(s?: string): number {
  if (!s) return 999;
  const n = parseFloat(s);
  if (isNaN(n)) return 999;
  if (/tb|تيرا/i.test(s)) return n * 1024;
  return n;
}

const orangeFirstCategories = ["ابل ايفون 17 برو ماكس", "ابل ايفون 17 برو"];

function colorOrder(color: string, isOrangeFirst: boolean): number {
  if (isOrangeFirst && /برتقالي|orange/i.test(color)) return -1;
  return 0;
}

function CategoryRow({ category, items, isFirst }: { category: string; items: Product[]; isFirst?: boolean }) {
  const isOrangeFirst = orangeFirstCategories.includes(category);
  const colors = [...new Set(items.map((p) => p.color || ""))];
  colors.sort((a, b) => {
    const ao = colorOrder(a, isOrangeFirst), bo = colorOrder(b, isOrangeFirst);
    if (ao !== bo) return ao - bo;
    return a.localeCompare(b);
  });
  const colorRank = new Map(colors.map((c, i) => [c, i]));
  const visible = [...items].sort((a, b) => {
    const sa = parseStorage(a.storage), sb = parseStorage(b.storage);
    if (sa !== sb) return sa - sb;
    return (colorRank.get(a.color || "") ?? 99) - (colorRank.get(b.color || "") ?? 99);
  }).slice(0, LIMIT);
  const href = categoryPageMap[category] ?? categoryPageMap[category.toLowerCase()] ?? `/search?q=${encodeURIComponent(category)}`;

  return (
    <div className="mb-8 sm:mb-12">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-7" dir="rtl">
        <div className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-b from-[#A842E4] to-[#611FA0]" />
        <h2 className="text-base sm:text-lg md:text-xl font-black text-gray-900">{category}</h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8543C0]/15 to-transparent" />
        <Link
          href={href}
          className="text-[11px] sm:text-xs font-bold text-[#7A2FCC] hover:text-[#A842E4] transition-colors flex items-center gap-1"
        >
          عرض الكل
          <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {visible.map((p, i) => (
          <ProductCard key={p._id} product={p} priority={isFirst && i === 0} />
        ))}
      </div>
    </div>
  );
}

type HomeSettings = { category: string; subCategory: string; showInHome: boolean; order: number };
type HomeConfig = { settings: HomeSettings[]; max: number };

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [bannerMap, setBannerMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products`).then((r) => r.json()),
      fetch("/api/sub-categories-home").then((r) => r.json()).catch(() => ({ settings: [], max: 4 })),
    ])
      .then(([prods, config]) => {
        setProducts(prods);
        setHomeConfig(Array.isArray(config) ? { settings: config, max: 4 } : config);
        const cats = [...new Set((prods as Product[]).map((p) => p.category).filter(Boolean))];
        if (cats.length) {
          fetch(`/api/admin/category-banners-bulk?categories=${encodeURIComponent(cats.join(","))}`)
            .then((r) => r.json())
            .then((data) => { if (data && typeof data === "object") setBannerMap(data); })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    return map;
  }, [products]);

  const orderedCategories = useMemo(() => {
    const allCats = Object.keys(grouped).filter((c) => c !== "أخرى");
    if (!homeConfig) return allCats;
    const { settings, max } = homeConfig;
    const visibleSettings = settings.filter((s) => s.showInHome);
    if (visibleSettings.length === 0) return allCats;
    const orderedCats = visibleSettings
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
      .map((s) => s.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .filter((c) => allCats.includes(c));
    const unconfigured = allCats.filter((c) => !settings.some((s) => s.category === c) && c !== "أخرى");
    return [...orderedCats, ...unconfigured];
  }, [grouped, homeConfig]);

  if (loading) return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      {[1, 2, 3].map((g) => (
        <div key={g} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-purple-200 animate-pulse" />
            <div className="h-5 w-36 bg-purple-100 animate-pulse rounded-lg" />
            <div className="flex-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <div className="w-full aspect-square bg-gradient-to-b from-gray-50 to-white animate-pulse" />
                <div className="p-3.5 space-y-2.5">
                  <div className="h-3.5 bg-gray-100 animate-pulse rounded-full w-[80%]" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded-full w-[55%]" />
                  <div className="h-10 bg-purple-50 animate-pulse rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );

  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full py-8 sm:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {orderedCategories.map((category, catIdx) => (
          <div key={category}>
            {bannerMap[category] && (
              <div className="-mx-3 sm:-mx-4 mb-5 sm:mb-7">
                <CategoryBanner category={category} images={bannerMap[category]} />
              </div>
            )}
            <CategoryRow category={category} items={grouped[category]} isFirst={catIdx === 0} />
          </div>
        ))}
      </div>
    </section>
  );
}

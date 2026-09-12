"use client";
import { useRef } from "react";
import CategorySlider from "./CategorySlider";

type Category = {
  name: string;
  count: number;
  image: string;
  href: string;
  featured?: boolean;
};

export default function ShopByCategoryClient({ categories }: { categories: Category[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: dir === "next" ? -360 : 360,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-10 sm:py-14" dir="rtl">
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-7 sm:mb-9">
        <div className="flex items-center gap-4">
          {/* accent pill */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="w-1.5 h-5 rounded-full bg-[#A842E4]" />
            <span className="w-1.5 h-2.5 rounded-full bg-[#C084FC]/50" />
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] sm:text-xs font-semibold text-[#A842E4] tracking-wider uppercase">
              Browse Categories
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              تسوق حسب الأقسام
            </h2>
          </div>

          {/* divider */}
          <div className="flex-1 flex items-center gap-2 mr-2">
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8543C0]/20 to-[#8543C0]/10" />
            <span className="text-[#C084FC]/60 text-lg">✦</span>
          </div>

          {/* ── Arrows ── */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("prev")}
              aria-label="السابق"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-[#A842E4] hover:border-[#A842E4] hover:text-white text-gray-500 transition-all duration-200 shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="التالي"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-[#A842E4] hover:border-[#A842E4] hover:text-white text-gray-500 transition-all duration-200 shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Slider ── */}
      <CategorySlider categories={categories} trackRef={trackRef} />
    </section>
  );
}

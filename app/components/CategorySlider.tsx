"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      dir="rtl"
      style={{
        maskImage: "linear-gradient(to left, transparent 0%, black 3%, black 97%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 3%, black 97%, transparent 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-3 sm:gap-4 w-max animate-scroll-rtl"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[...categories, ...categories, ...categories].map((cat, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={`${cat.name}-${i}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative shrink-0"
            >
              <Link
                href={cat.href}
                className={`relative flex flex-col items-center gap-2.5 py-5 px-4 sm:py-6 sm:px-5 rounded-3xl border transition-all duration-300 w-[120px] sm:w-[140px] ${
                  isHovered
                    ? "bg-white border-[#A842E4]/20 shadow-[0_8px_32px_rgba(133,67,192,0.12)] -translate-y-1.5 scale-[1.02]"
                    : "bg-white/90 border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                }`}
              >
                {/* Image Container */}
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isHovered ? "bg-gradient-to-br from-[#f5edfc] to-[#ece3f8]" : "bg-gray-50"
                }`}>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized
                      className={`object-contain p-1.5 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
                      sizes="56px"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-xl">🛍️</span>
                  )}
                </div>

                {/* Name */}
                <span className={`text-[10px] sm:text-[11px] font-bold text-center leading-tight line-clamp-2 transition-colors duration-200 ${
                  isHovered ? "text-[#7A2FCC]" : "text-gray-700"
                }`}>
                  {cat.name}
                </span>

                {/* Count */}
                {cat.count > 0 && (
                  <span className={`text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${
                    isHovered ? "bg-[#7A2FCC] text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {cat.count} منتج
                  </span>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.333%); }
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 70s linear infinite;
        }
      `}</style>
    </div>
  );
}

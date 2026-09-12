"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Category = {
  name: string;
  count: number;
  image: string;
  href: string;
  featured?: boolean;
};

export default function CategorySlider({
  categories,
  trackRef,
}: {
  categories: Category[];
  trackRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative w-full" dir="rtl">
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[#f8f5ff] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[#f8f5ff] to-transparent" />

      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto px-6 sm:px-10 pb-4 pt-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((cat, i) => (
          <CategoryCard key={`${cat.name}-${i}`} cat={cat} />
        ))}
      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
function CategoryCard({ cat }: { cat: Category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={cat.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative shrink-0 flex flex-col justify-end overflow-hidden rounded-2xl
        w-[155px] h-[200px] sm:w-[175px] sm:h-[220px]
        transition-all duration-300 ease-out
        ${hovered
          ? "shadow-[0_16px_48px_rgba(124,58,237,0.22)] -translate-y-1.5 scale-[1.03]"
          : "shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
        }
        ${cat.featured ? "ring-2 ring-[#A842E4]/50" : ""}
      `}
    >
      {/* background image */}
      {cat.image ? (
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          unoptimized
          className={`object-cover transition-transform duration-500 ease-out ${
            hovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width:640px) 155px, 175px"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-4xl">
          🛍️
        </div>
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* featured badge */}
      {cat.featured && (
        <span className="absolute top-3 right-3 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A842E4] text-white tracking-wide shadow">
          جديد
        </span>
      )}

      {/* text + button */}
      <div className="relative z-10 p-3 sm:p-3.5 flex flex-col gap-2">
        <span className="text-white font-black text-[13px] sm:text-sm leading-snug line-clamp-2 drop-shadow-md">
          {cat.name}
        </span>

        {cat.count > 0 && (
          <span className="text-white/60 text-[10px] font-medium">
            {cat.count} منتج
          </span>
        )}

        <div
          className={`
            w-full flex items-center justify-center gap-1.5
            text-[11px] font-bold py-1.5 rounded-xl
            transition-all duration-300
            ${hovered ? "bg-white text-[#7C3AED] shadow-md" : "bg-white/20 text-white backdrop-blur-sm"}
          `}
        >
          تسوق الآن
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <path d="M7 5H3M5 3L3 5L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

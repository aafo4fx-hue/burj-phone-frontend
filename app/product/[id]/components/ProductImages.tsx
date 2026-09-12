"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 md:gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex sm:flex-col gap-1.5 sm:gap-2 md:gap-3 sm:w-16 md:w-20 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] scrollbar-hide py-1 sm:py-0 px-0.5">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-[72px] md:h-[72px] rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === selected
                  ? "border-[#0F4C6E] shadow-md shadow-[#0F4C6E]/15"
                  : "border-gray-200 hover:border-[#1F6F8B]/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image src={img} alt="" fill className="object-contain p-1 sm:p-1.5" sizes="72px" unoptimized />
              {i === selected && (
                <motion.div
                  layoutId="thumb-indicator"
                  className="absolute inset-0 rounded-md sm:rounded-[10px] border-2 border-[#0F4C6E]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1">
        <div
          ref={imgRef}
          className="relative aspect-square rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-white cursor-crosshair group"
          style={{
            boxShadow: "0 2px 20px rgba(15,76,110,0.06), 0 8px 40px rgba(15,76,110,0.04)",
          }}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4">
              <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg shadow-red-500/25">
                {discountPercent}%-
              </span>
            </div>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute z-10 top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-black/40 backdrop-blur-md text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
              {selected + 1}/{images.length}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {images.length > 0 ? (
                <div
                  className="w-full h-full transition-transform duration-300"
                  style={{
                    transform: zoomed ? "scale(1.8)" : "scale(1)",
                    transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                  }}
                >
                  <Image
                    src={images[selected]}
                    alt={name}
                    fill
                    className="object-contain p-4 sm:p-6 md:p-10"
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📱</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
            <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full">
              مرر الماوس للتكبير 🔍
            </span>
          </div>

          {/* Navigation arrows for mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelected((selected + 1) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md sm:hidden active:scale-90 transition"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelected((selected - 1 + images.length) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md sm:hidden active:scale-90 transition"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

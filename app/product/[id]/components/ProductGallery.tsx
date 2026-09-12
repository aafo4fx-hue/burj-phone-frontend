"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductGallery({ images, name, discountPercent = 0 }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="relative w-full bg-white">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/4] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/8] overflow-hidden">
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute z-10 top-16 right-4 sm:top-20 sm:right-6">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {discountPercent}%-
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {images.length > 0 ? (
              <Image
                src={images[selected]}
                alt={name}
                fill
                className="object-contain p-8 sm:p-12 md:p-16"
                priority
                sizes="100vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 text-7xl">📱</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
            {selected + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails - horizontal scroll */}
      {images.length > 1 && (
        <div className="flex gap-2 px-4 pb-4 pt-2 overflow-x-auto scrollbar-hide justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                i === selected
                  ? "border-[#8543C0] shadow-md shadow-[#8543C0]/15"
                  : "border-gray-200 hover:border-[#A842E4]/50"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" sizes="64px" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

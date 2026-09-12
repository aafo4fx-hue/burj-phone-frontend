"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_PLAY_MS = 4500;
const SWIPE_THRESHOLD = 50;

function CategoryBannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = (i + images.length) % images.length;
      setDirection(dir ?? (next > current ? 1 : -1));
      setProgress(0);
      setCurrent(next);
    },
    [images.length, current]
  );

  useEffect(() => {
    if (isHovered) return;
    intervalRef.current = setInterval(() => goTo(current + 1, 1), AUTO_PLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, goTo, isHovered]);

  useEffect(() => {
    if (isHovered) return;
    setProgress(0);
    const step = 30;
    const inc = (step / AUTO_PLAY_MS) * 100;
    progressRef.current = setInterval(() => setProgress((p) => Math.min(p + inc, 100)), step);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current, isHovered]);

  const variants = {
    enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: `${-d * 100}%`, opacity: 0 }),
  };

  return (
    <div className="w-full px-3 sm:px-4 py-2">
      <motion.div
        className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          boxShadow: "0 4px 24px rgba(15,76,110,0.10), 0 1.5px 6px rgba(0,0,0,0.06)",
        }}
        whileHover={{
          boxShadow: "0 8px 32px rgba(15,76,110,0.18), 0 2px 10px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient border accent */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl z-30 pointer-events-none"
          style={{ border: "1.5px solid rgba(124,192,67,0.25)" }}
        />

        <div
          className="relative w-full aspect-[1.9/1] sm:aspect-[2.2/1]"
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
          }}
        >
          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0F4C6E]/5 via-transparent to-[#0F4C6E]/5" />

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                className="w-full h-full"
                animate={{ scale: [1, 1.03] }}
                transition={{ duration: AUTO_PLAY_MS / 1000, ease: "linear" }}
              >
                <Image
                  src={images[current]}
                  alt={`banner ${current + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 960px"
                  loading={current === 0 ? "eager" : "lazy"}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                onClick={() => goTo(current + 1, 1)}
                aria-label="التالي"
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
                whileHover={{ scale: 1.15, background: "rgba(124,192,67,0.5)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => goTo(current - 1, -1)}
                aria-label="السابق"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
                whileHover={{ scale: 1.15, background: "rgba(124,192,67,0.5)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Progress bar */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #7CC043, #5FA32E)",
                }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {images.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`الانتقال للشريحة ${i + 1}`}
              className="rounded-full cursor-pointer"
              animate={{
                width: i === current ? 20 : 7,
                height: 7,
                backgroundColor: i === current ? "#1F6F8B" : "#d1d5db",
              }}
              whileHover={{ backgroundColor: "#7CC043" }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryBanner({ category, images: propImages }: { category: string; images?: string[] }) {
  const images = propImages ?? [];
  if (!images.length) return null;
  return <CategoryBannerSlider images={images} />;
}

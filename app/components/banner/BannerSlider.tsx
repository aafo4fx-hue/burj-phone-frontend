"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_PLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
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
    intervalRef.current = setInterval(() => goTo(current + 1, 1), AUTO_PLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, goTo]);

  useEffect(() => {
    setProgress(0);
    const step = 30;
    const inc = (step / AUTO_PLAY_MS) * 100;
    progressRef.current = setInterval(() => setProgress((p) => Math.min(p + inc, 100)), step);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: `${-d * 100}%`, opacity: 0 }),
  };

  return (
    <section className="w-full flex justify-center pt-3 sm:pt-5 pb-1 sm:pb-2 px-3 sm:px-4 md:px-6">
      <div className="relative w-full max-w-7xl">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg"
          style={{ boxShadow: "0 4px 24px rgba(133,67,192,0.12)" }}
        >
          <div
            className="relative w-full aspect-[1.9/1] sm:aspect-[2.2/1]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt={`banner ${current + 1}`}
                  fill
                  className="object-cover"
                  priority={current === 0}
                  unoptimized
                  sizes="100vw"
                />
              </motion.div>
            </AnimatePresence>


            {/* Progress bar */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-black/10">
                <motion.div
                  className="h-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #A842E4, #7A2FCC)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Simple dots - no images */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`الانتقال للشريحة ${i + 1}`}
                className="transition-all duration-300 rounded-full cursor-pointer"
                style={{
                  width: i === current ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: i === current ? "#8543C0" : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

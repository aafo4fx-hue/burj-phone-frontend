"use client";

import { motion } from "framer-motion";

const particles = [
  { size: 12, x: "5%", y: "12%", duration: 12, delay: 0, color: "#a855f7" },
  { size: 10, x: "88%", y: "20%", duration: 15, delay: 2, color: "#6366f1" },
  { size: 14, x: "22%", y: "50%", duration: 10, delay: 4, color: "#ec4899" },
  { size: 11, x: "72%", y: "65%", duration: 14, delay: 1, color: "#8b5cf6" },
  { size: 9, x: "48%", y: "82%", duration: 11, delay: 3, color: "#06b6d4" },
  { size: 13, x: "35%", y: "8%", duration: 13, delay: 5, color: "#f59e0b" },
  { size: 10, x: "92%", y: "48%", duration: 16, delay: 2.5, color: "#10b981" },
  { size: 8, x: "60%", y: "35%", duration: 12, delay: 1.5, color: "#f43f5e" },
  { size: 11, x: "15%", y: "78%", duration: 14, delay: 3.5, color: "#6366f1" },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: p.color,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

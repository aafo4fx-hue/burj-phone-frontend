"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline,
  IoCheckmarkCircle,
  IoShieldCheckmark,
  IoCarOutline,
  IoCheckmarkDoneCircle,
  IoFlashOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart }: ProductInfoProps) {
  const router = useRouter();
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const savedAmount = hasDiscount ? originalPrice - (salePrice ?? 0) : 0;
  const discountPercent = hasDiscount ? Math.round((savedAmount / originalPrice) * 100) : 0;

  const features = [
    { icon: <IoCarOutline size={18} />, label: freeDelivery ? "توصيل مجاني" : "توصيل", value: deliveryTime, color: "#0F4C6E" },
    { icon: <IoShieldCheckmark size={18} />, label: "ضمان سنتين", value: "حاسبات العرب", color: "#7CC043" },
    { icon: inStock ? <IoCheckmarkCircle size={18} /> : <IoStorefrontOutline size={18} />, label: inStock ? "متوفر" : "غير متوفر", value: inStock ? "جاهز للشحن" : "نفذت الكمية", color: inStock ? "#34d399" : "#ef4444" },
    { icon: <IoFlashOutline size={18} />, label: "شحن سريع", value: "توصيل فوري", color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-20">

      {/* ── Name & Specs ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl sm:rounded-3xl product-card-shadow overflow-hidden"
      >
        <div className="p-4 sm:p-5">
          {brand && (
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F4C6E] bg-[#0F4C6E]/6 px-3 py-1 rounded-full">
                {brand}
              </span>
              {inStock && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  متوفر
                </span>
              )}
            </div>
          )}
          <h2 className="text-[15px] sm:text-lg lg:text-xl font-extrabold text-gray-900 leading-[1.6]">{name}</h2>
        </div>

        {/* Specs chips */}
        {(color || storage || network) && (
          <div className="flex gap-0 border-t border-gray-100">
            {[
              { label: "اللون", val: color },
              { label: "التخزين", val: storage },
              { label: "الشبكة", val: network },
            ].filter(s => s.val).map((s, i, arr) => (
              <div
                key={i}
                className={`flex-1 text-center py-2.5 sm:py-3 ${i < arr.length - 1 ? "border-l border-gray-100" : ""}`}
              >
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium">{s.label}</p>
                <p className="text-[11px] sm:text-xs font-bold text-[#0F4C6E] mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Premium Price Card ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl product-card-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3550] via-[#0F4C6E] to-[#1a5c3a]" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#7CC043]/15 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[40px]" />

        <div className="relative p-3 sm:p-6">
          {hasDiscount && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg shadow-red-500/30">
                🔥 خصم {discountPercent}%
              </span>
              <span className="text-[10px] sm:text-xs text-white/50 line-through">{fmt(originalPrice)} ر.س</span>
            </div>
          )}

          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {fmt(hasDiscount ? salePrice! : originalPrice)}
            </span>
            <span className="text-xs sm:text-base font-bold text-white/70">ر.س</span>
          </div>

          {hasDiscount && (
            <div className="mt-2 sm:mt-4">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className="text-[10px] sm:text-xs text-[#b8e986] font-semibold">
                  وفّرت {fmt(savedAmount)} ر.س
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/40">{discountPercent}% توفير</span>
              </div>
              <div className="h-1 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7CC043] to-[#b8e986]"
                  initial={{ width: 0 }}
                  animate={{ width: `${discountPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
            {taxIncluded && (
              <span className="text-[9px] sm:text-[11px] text-white/40 bg-white/5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10">
                شامل الضريبة
              </span>
            )}
            {installment?.available && (
              <span className="text-[9px] sm:text-[11px] text-[#b8e986] bg-[#7CC043]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#7CC043]/20">
                💳 تقسيط متاح
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Features List ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl sm:rounded-3xl product-card-shadow p-1 sm:p-1.5"
      >
        {features.map((f, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-colors hover:bg-gray-50/80 ${
              i < features.length - 1 ? "" : ""
            }`}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${f.color}10`, color: f.color }}
            >
              {f.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-gray-800">{f.label}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">{f.value}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f.color, opacity: 0.5 }} />
          </div>
        ))}
      </motion.div>

      {/* ── Add to Cart ── */}
      <AnimatePresence mode="wait">
        {!addedToCart ? (
          <motion.button
            key="add"
            onClick={onAddToCart}
            className="w-full bg-gradient-to-r from-[#0F4C6E] to-[#1F6F8B] hover:from-[#0a3550] hover:to-[#0F4C6E] text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-[#0F4C6E]/20 cursor-pointer"
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <IoCartOutline size={22} />
            أضف للسلة
          </motion.button>
        ) : (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-center gap-2 text-[#5a9030] bg-gradient-to-r from-[#eaf5d8] to-[#f0f9e8] py-3 rounded-2xl">
              <IoCheckmarkDoneCircle size={20} />
              <span className="text-sm font-bold">تمت الإضافة للسلة بنجاح ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => router.back()}
                className="bg-[#0F4C6E]/5 hover:bg-[#0F4C6E]/10 text-[#0F4C6E] font-bold text-xs sm:text-sm py-3 rounded-xl transition-colors cursor-pointer"
              >
                متابعة التسوق
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="bg-gradient-to-r from-[#0F4C6E] to-[#1F6F8B] text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#0F4C6E]/15 cursor-pointer"
              >
                <IoCartOutline size={16} />
                السلة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

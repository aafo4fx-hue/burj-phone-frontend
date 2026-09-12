"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoAddCircle, IoRemoveCircle, IoTrashOutline } from "react-icons/io5";

const SAR = () => (
  <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block w-[27px] h-[27px]" />
);

const fmt = (n: number) => n.toLocaleString("ar-SA");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  index: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

export default function CartItem({ product, qty, index, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;
  const lineTotal = price * qty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative bg-white rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 border border-[#8543C0]/[0.06] shadow-[0_2px_12px_rgba(133,67,192,0.04)] hover:shadow-[0_8px_30px_rgba(133,67,192,0.1)] hover:border-[#8543C0]/[0.12] transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#f9f5ff] to-[#f3eafc]">
        {img ? (
          <Image src={img} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-3xl flex items-center justify-center w-full h-full">📱</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="text-sm sm:text-[15px] font-bold text-gray-800 leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[13px] sm:text-sm font-extrabold text-[#7A2FCC] mt-1.5">
            {fmt(price)} <span className="text-[11px] font-medium text-gray-400"><SAR /></span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Qty Controls */}
          <div className="flex items-center gap-0.5 bg-[#f9f5ff] rounded-full px-1.5 py-1 border border-[#8543C0]/10">
            <button onClick={() => onUpdateQty(product._id, qty - 1)} className="hover:scale-110 transition-transform active:scale-90">
              <IoRemoveCircle size={22} className="text-gray-300 hover:text-[#611FA0] transition-colors" />
            </button>
            <span className="text-sm font-bold w-7 text-center text-gray-800 tabular-nums">{qty}</span>
            <button onClick={() => onUpdateQty(product._id, qty + 1)} className="hover:scale-110 transition-transform active:scale-90">
              <IoAddCircle size={22} className="text-[#8543C0] hover:text-[#7A2FCC] transition-colors" />
            </button>
          </div>

          {/* Line Total */}
          <div className="text-left">
            <p className="text-xs text-gray-400">الإجمالي</p>
            <p className="text-sm font-extrabold text-[#611FA0]">{fmt(lineTotal)} <span className="text-[10px] text-gray-400 font-medium"><SAR /></span></p>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onRemove(product._id)}
        className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all duration-200"
      >
        <IoTrashOutline size={14} className="text-red-400" />
      </button>
    </motion.div>
  );
}

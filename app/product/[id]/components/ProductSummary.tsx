"use client";

import Image from "next/image";
import { IoShieldCheckmark, IoCarOutline, IoFlashOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

function getColorHex(color: string): string {
  const c = color.toLowerCase();
  if (c.includes("أسود") || c.includes("اسود") || c.includes("black")) return "#1a1a1a";
  if (c.includes("أبيض") || c.includes("ابيض") || c.includes("white")) return "#f5f5f5";
  if (c.includes("سيلفر") || c.includes("فضي") || c.includes("silver")) return "#c0c0c0";
  if (c.includes("ذهبي") || c.includes("gold")) return "#d4af37";
  if (c.includes("أزرق") || c.includes("ازرق") || c.includes("blue")) return "#3b82f6";
  if (c.includes("أحمر") || c.includes("احمر") || c.includes("red")) return "#ef4444";
  if (c.includes("أخضر") || c.includes("اخضر") || c.includes("green")) return "#22c55e";
  if (c.includes("بنفسجي") || c.includes("purple")) return "#a855f7";
  if (c.includes("وردي") || c.includes("pink") || c.includes("روز")) return "#ec4899";
  if (c.includes("برتقال") || c.includes("orange")) return "#f97316";
  if (c.includes("بيج") || c.includes("beige") || c.includes("كريمي")) return "#d4c5a9";
  if (c.includes("رمادي") || c.includes("gray") || c.includes("grey")) return "#6b7280";
  if (c.includes("تيتانيوم") || c.includes("titanium")) return "#8a8a8a";
  if (c.includes("صحراوي") || c.includes("desert") || c.includes("sand")) return "#c2a878";
  return "#9ca3af";
}

interface Props {
  product: Product;
}

export default function ProductSummary({ product }: Props) {
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const savedAmount = hasDiscount ? originalPrice - (salePrice ?? 0) : 0;

  return (
    <div className="space-y-5">
      {/* Brand & Status */}
      <div className="flex items-center gap-2 flex-wrap">
        {brand && (
          <span className="text-xs font-semibold text-[#7A2FCC] bg-[#8543C0]/5 px-3 py-1 rounded-full">
            {brand}
          </span>
        )}
        {inStock ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            متوفر
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
            غير متوفر
          </span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-[1.4]">
        {name}
      </h1>

      {/* Specs Tags */}
      {(color || storage || network) && (
        <div className="flex flex-wrap gap-2">
          {color && (
            <span className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-gray-300 shrink-0 animate-pulse" style={{ backgroundColor: getColorHex(color) }} />
              {color}
            </span>
          )}
          {storage && (
            <span className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              {storage}
            </span>
          )}
          {network && (
            <span className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
              {network}
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="bg-white rounded-2xl border border-[#8543C0]/8 p-4 sm:p-5 shadow-sm shadow-[#8543C0]/5">
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              وفّر {fmt(savedAmount)}
              <Image src="/money-icon.webp" alt="ر.س" width={25} height={25} className="inline-block" />
            </span>
            <span className="text-sm text-gray-400 line-through flex items-center gap-1">
              {fmt(originalPrice)}
              <Image src="/money-icon.webp" alt="ر.س" width={2} height={25} className="inline-block opacity-50" />
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-gray-900">
            {fmt(hasDiscount ? salePrice! : originalPrice)}
          </span>
          <Image src="/money-icon.webp" alt="ر.س" width={30} height={30} className="inline-block" />
        </div>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {taxIncluded && (
            <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
              شامل الضريبة
            </span>
          )}
          {installment?.available && (
            <span className="text-[11px] text-[#7A2FCC] bg-[#8543C0]/5 px-2.5 py-1 rounded-full font-medium">
              💳 تقسيط متاح
            </span>
          )}
        </div>
      </div>

      {/* Quick Features */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#8543C0]/8">
          <IoCarOutline size={20} className="text-[#7A2FCC] mb-1.5" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700">
            {freeDelivery ? "توصيل مجاني" : "توصيل"}
          </span>
          {deliveryTime && <span className="text-[9px] text-gray-400 mt-0.5">{deliveryTime}</span>}
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#8543C0]/8">
          <IoShieldCheckmark size={20} className="text-[#7A2FCC] mb-1.5" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700">ضمان</span>
          <span className="text-[9px] text-gray-400 mt-0.5">حاسبات العرب</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#8543C0]/8">
          <IoFlashOutline size={20} className="text-[#7A2FCC] mb-1.5" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700">شحن سريع</span>
          <span className="text-[9px] text-gray-400 mt-0.5">توصيل فوري</span>
        </div>
      </div>
    </div>
  );
}

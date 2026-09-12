"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GoShieldCheck } from "react-icons/go";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  const clean = src.replace(/&amp;/g, "&");
  return clean.startsWith("http") ? clean : `${API}${clean.startsWith("/") ? clean : "/" + clean}`;
};

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, salePrice, discountPercent = 0, freeDelivery, warrantyYears, inStock } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-base font-medium animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        className="group relative bg-white rounded-3xl overflow-hidden flex flex-col h-full border border-gray-100/80 shadow-[0_2px_12px_rgba(133,67,192,0.06)] hover:shadow-[0_12px_40px_rgba(133,67,192,0.12)] hover:-translate-y-1 transition-all duration-400"
        dir="rtl"
      >
        {/* Image Section */}
        <div className="relative w-full bg-gradient-to-b from-gray-50/80 to-white" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0 p-3 sm:p-5">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={name}
                fill
                className="object-contain p-3 sm:p-5 group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📱</div>
            )}
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
              <span className="bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl leading-none shadow-lg shadow-red-200/50">
                {discountPercent}%-
              </span>
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
            {inStock ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50/90 backdrop-blur-sm text-emerald-600 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                متوفر
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-gray-50/90 backdrop-blur-sm text-gray-500 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-200">
                غير متوفر
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-3 sm:px-4 pt-3 pb-2 flex flex-col gap-2 flex-1">
          <h3 className="text-[11px] sm:text-[13px] md:text-sm font-bold text-gray-800 leading-relaxed line-clamp-2 group-hover:text-[#7A2FCC] transition-colors duration-300">
            {name}
          </h3>

          {(freeDelivery || warrantyYears > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {freeDelivery && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  <TbTruckDelivery size={11} />
                  مجاني
                </span>
              )}
              {warrantyYears > 0 && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-semibold">
                  <GoShieldCheck size={10} />
                  {warrantyYears}س
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-auto pt-2">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl font-black text-gray-900">
                  {fmt(salePrice)}
                </span>
                <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block" />
                <span className="text-[11px] sm:text-xs text-red-400 line-through">
                  {fmt(originalPrice)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg md:text-xl font-black text-gray-900">
                  {fmt(originalPrice)}
                </span>
                <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block" />
              </div>
            )}
          </div>
        </div>

        {/* Cart Button */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`product-cart-btn ${added ? "added" : ""} ${!inStock ? "!bg-gray-200 !shadow-none !from-gray-200 !to-gray-300 cursor-not-allowed" : ""}`}
          >
            {added ? (
              <><IoCheckmarkCircleOutline size={16} />تمت الإضافة</>
            ) : (
              <><IoCartOutline size={16} />{inStock ? "أضف للسلة" : "غير متوفر"}</>
            )}
          </button>
        </div>
      </Link>
    </>
  );
}

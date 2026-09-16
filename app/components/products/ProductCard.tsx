"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { GoShieldCheck } from "react-icons/go";
import { MdOutlinePayment } from "react-icons/md";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const formatStorage = (storage: string): string => {
  if (!storage) return storage;
  return storage
    .replace(/(\d+)\s*جيجابايت/gi, '$1 GB')
    .replace(/(\d+)\s*جيجا\s*بايت/gi, '$1 GB')
    .replace(/(\d+)\s*جيجا/gi, '$1 GB')
    .replace(/(\d+)\s*تيرابايت/gi, '$1 TB')
    .replace(/(\d+)\s*تيرا\s*بايت/gi, '$1 TB')
    .replace(/(\d+)\s*تيرا/gi, '$1 TB')
    .trim();
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  const clean = src.replace(/&amp;/g, "&");
  return clean.startsWith("http") ? clean : `${API}${clean.startsWith("/") ? clean : "/" + clean}`;
};

export default function ProductCard({ product, priority = false, zoomOnHover = false }: { product: Product; priority?: boolean; zoomOnHover?: boolean }) {
  const { name, salePrice, discountPercent = 0, inStock } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const displayPrice = hasDiscount ? salePrice! : originalPrice;
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
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        dir="rtl"
        className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* ── Image ── */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square bg-white overflow-hidden">
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className={`object-contain p-1.5 sm:p-3 transition-transform duration-500 ${zoomOnHover ? "zoom-hover-125" : ""}`}
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">📱</div>
          )}

          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">غير متوفر</span>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col flex-1 p-2 sm:p-3.5 gap-1.5 sm:gap-2.5">

          {/* Name */}
          <h3 className="text-[11px] sm:text-[13.5px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
            {name}
          </h3>

          {/* Badges */}
          {(product.storage || product.freeDelivery || product.warrantyYears >= 2) && (
            <div className="flex flex-wrap gap-1">
              {product.storage && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                  {formatStorage(product.storage)}
                </span>
              )}
              {product.freeDelivery && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                  <TbTruckDelivery size={10} />توصيل مجاني
                </span>
              )}
              {product.warrantyYears >= 2 && (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                  <GoShieldCheck size={10} />ضمان سنتين
                </span>
              )}
            </div>
          )}

          {product.warrantyYears >= 2 && (
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg w-fit">
              <MdOutlinePayment size={10} />تقسيط بسعر الكاش
            </span>
          )}

          {/* Price */}
          <div className="mt-auto pt-1 flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[15px] sm:text-[21px] font-black text-gray-900 leading-none tracking-tight">
                {fmt(displayPrice)}
              </span>
              <Image src="/money-icon.webp" alt="ر.س" width={18} height={18} quality={100} className="opacity-80 shrink-0 sm:w-[26px] sm:h-[26px]" loading="lazy" />
            </div>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[11px] text-gray-400 line-through font-medium">{fmt(originalPrice)} ر.س</span>
            )}
          </div>

          {/* Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={
              `w-full flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[13px] font-bold py-1.5 sm:py-2.5 transition-all duration-200 ${
                added
                  ? "bg-green-500 text-white"
                  : inStock
                  ? "bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`
            }
          >
            {added ? (
              <><IoCheckmarkCircleOutline size={12} className="sm:w-[15px] sm:h-[15px]" />تمتالإضافة</>
            ) : inStock ? (
              <><IoCartOutline size={12} className="sm:w-[15px] sm:h-[15px]" />أضف للسلة</>
            ) : (
              <>غير متوفر</>
            )}
          </button>

        </div>
      </Link>
    </>
  );
}

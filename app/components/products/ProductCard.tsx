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

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
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
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-base font-medium animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        className="pc-card group"
        dir="rtl"
      >
        {/* ── Image Zone ── */}
        <div className="pc-img-zone">
          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">📱</div>
          )}

          {discountPercent > 0 && (
            <span className="pc-discount-badge">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* ── Content ── */}
        <div className="pc-body">
          <h3 className="pc-name">{name}</h3>

          {(product.warrantyYears > 0 || product.storage || product.freeDelivery) && (
            <div className="flex flex-wrap gap-1.5 items-center">
              {product.storage && (
                <span className="pc-badge pc-badge-gray">{formatStorage(product.storage)}</span>
              )}
              {product.freeDelivery && (
                <span className="pc-badge pc-badge-green">
                  <TbTruckDelivery size={12} />
                  توصيل مجاني
                </span>
              )}
              {product.warrantyYears >= 2 && (
                <>
                  <span className="pc-badge pc-badge-blue">
                    <GoShieldCheck size={12} />
                    ضمان سنتين
                  </span>
                  <span className="pc-badge pc-badge-purple">
                    <MdOutlinePayment size={12} />
                    تقسيط بسعر الكاش
                  </span>
                </>
              )}
            </div>
          )}

          <div className="pc-price-row">
            <span className="pc-price">{fmt(displayPrice)}</span>
            <Image src="/money-icon.webp" alt="ر.س" width={32} height={32} className="inline-block opacity-90 shrink-0" loading="lazy" />
            {hasDiscount && (
              <span className="pc-old-price">{fmt(originalPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`pc-btn ${added ? "pc-btn-added" : inStock ? "pc-btn-cart" : "pc-btn-oos"}`}
          >
            {added ? (
              <><IoCheckmarkCircleOutline size={15} />تمت الإضافة</>
            ) : (
              <><IoCartOutline size={15} />{inStock ? "أضف للسلة" : "غير متوفر"}</>
            )}
          </button>
        </div>
      </Link>
    </>
  );
}

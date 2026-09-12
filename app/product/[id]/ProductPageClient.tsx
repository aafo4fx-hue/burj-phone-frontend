"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowForward, IoShareSocialOutline, IoCartOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductGallery from "./components/ProductGallery";
import ProductSummary from "./components/ProductSummary";
import ProductSpecs from "./components/ProductSpecs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id, initialProduct }: { id: string; initialProduct: Product | null }) {
  const router = useRouter();
  const [product] = useState<Product | null>(initialProduct);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center product-page-bg">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#8543C0]/5 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <p className="text-gray-500 text-lg font-medium">المنتج غير موجود</p>
        </div>
      </div>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

  const allImages = (product.images?.length ? product.images : product.image ? [product.image] : []).map(resolveImg);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const handleAddToCart = () => {
    addItem(product);
    setAddedToCart(true);
  };

  return (
    <main className="min-h-screen product-page-bg" dir="rtl">
      {/* Hero Section - Full width image */}
      <section className="relative">
        {/* Nav buttons inside hero */}
        <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl shadow-lg shadow-[#8543C0]/10 flex items-center justify-center cursor-pointer border border-[#8543C0]/10"
          >
            <IoArrowForward size={20} className="text-[#611FA0]" />
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl shadow-lg shadow-[#8543C0]/10 flex items-center justify-center cursor-pointer border border-[#8543C0]/10"
          >
            <IoShareSocialOutline size={20} className="text-[#611FA0]" />
          </motion.button>
        </div>
        <ProductGallery images={allImages} name={product.name} discountPercent={product.discountPercent} />
      </section>

      {/* Product Info Section */}
      <section className="relative -mt-8 z-10">
        <div className="bg-white rounded-t-[32px] pt-6 pb-4 px-4 sm:px-6 md:px-8 max-w-3xl mx-auto lg:max-w-5xl shadow-[0_-4px_20px_rgba(133,67,192,0.06)]">
          <ProductSummary product={product} />

          {/* Add to Cart - Sticky bottom */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {!addedToCart ? (
                <motion.button
                  key="add"
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7A2FCC] via-[#8543C0] to-[#A842E4] text-white font-bold text-[15px] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.97] transition-transform shadow-lg shadow-[#8543C0]/25"
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
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-3.5 rounded-2xl border border-emerald-100">
                    <IoCheckmarkDoneCircle size={20} />
                    <span className="text-sm font-bold">تمت الإضافة بنجاح ✓</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => router.back()}
                      className="py-3.5 rounded-xl bg-[#8543C0]/5 text-[#7A2FCC] font-bold text-sm cursor-pointer hover:bg-[#8543C0]/10 transition"
                    >
                      متابعة التسوق
                    </button>
                    <button
                      onClick={() => router.push("/cart")}
                      className="py-3.5 rounded-xl bg-gradient-to-r from-[#7A2FCC] to-[#8543C0] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#8543C0]/20"
                    >
                      <IoCartOutline size={16} />
                      عرض السلة
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Specs & Details Section */}
      <section className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto lg:max-w-5xl pb-24">
        <ProductSpecs
          overview={product.overview}
          detailedSpecs={product.detailedSpecs}
          installment={product.installment}
          description={product.description}
          specs={product.specs}
          image={product.overviewImage}
          productName={product.name}
        />
      </section>
    </main>
  );
}

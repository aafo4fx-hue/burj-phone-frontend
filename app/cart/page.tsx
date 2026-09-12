"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoCartOutline, IoChevronBack, IoBagCheckOutline, IoRocketOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const SAR = () => (
  <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block w-[27px] h-[27px]" />
);

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined : undefined;

  if (!mounted) return null;

  /* ── Empty State ── */
  if (items.length === 0)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-gradient-to-br from-[#f9f5ff] via-white to-[#f3eafc]" dir="rtl">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="w-32 h-32 bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/20 rounded-3xl rotate-6 flex items-center justify-center shadow-[0_20px_60px_rgba(133,67,192,0.15)]">
            <IoCartOutline size={52} className="text-[#8543C0]/50 -rotate-6" />
          </div>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
          <p className="text-gray-800 text-xl font-extrabold">السلة فارغة</p>
          <p className="text-gray-400 text-sm mt-2">لم تضف أي منتجات بعد</p>
        </motion.div>
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-[#7A2FCC] to-[#A842E4] text-white px-10 py-3.5 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(133,67,192,0.35)]"
        >
          تصفح المنتجات
        </motion.button>
      </main>
    );

  /* ── Cart with Items ── */
  return (
    <main className="min-h-screen pb-8 bg-gradient-to-br from-[#f9f5ff] via-[#fdfcff] to-[#f3eafc]" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#090D54] via-[#611FA0] to-[#7A2FCC] shadow-[0_4px_20px_rgba(133,67,192,0.2)]">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
              <IoChevronBack size={18} className="text-white/80 rotate-180" />
            </Link>
            <div>
              <h1 className="text-[15px] font-extrabold text-white">سلة التسوق</h1>
              <p className="text-[11px] text-white/50 font-medium">{count} منتج</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
            <IoBagCheckOutline size={14} className="text-[#A842E4]" />
            <span className="text-xs font-bold text-white">{fmt(total)} <SAR /></span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            <AnimatePresence>
              {items.map(({ product, qty }, i) => (
                <CartItem key={product._id} product={product} qty={qty} index={i} onUpdateQty={updateQty} onRemove={removeItem} />
              ))}
            </AnimatePresence>

            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: items.length * 0.08 + 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#090D54] via-[#611FA0] to-[#7A2FCC] rounded-xl sm:rounded-2xl p-3 sm:p-5 text-white shadow-[0_12px_40px_rgba(133,67,192,0.25)] max-w-md sm:max-w-none mx-auto sm:mx-0"
            >
              <div className="absolute top-0 left-0 w-40 h-40 bg-[#A842E4]/20 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#8543C0]/20 rounded-full translate-x-10 translate-y-10 blur-2xl" />
              <div className="relative space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-white/60 font-medium">المجموع</span>
                  <span className="font-bold">{fmt(total)} <SAR /></span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-white/60 font-medium">التوصيل</span>
                  <span className="text-[#A842E4] font-bold text-[10px] sm:text-xs flex items-center gap-1">
                    <IoRocketOutline size={12} /> مجاني
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 sm:pt-3 flex justify-between items-center">
                  <span className="font-bold text-xs sm:text-sm">الإجمالي</span>
                  <span className="text-lg sm:text-xl font-extrabold">{fmt(total)} <SAR /></span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="relative mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 text-white/40">
                  <IoShieldCheckmarkOutline size={14} />
                  <span className="text-[10px] font-medium">دفع آمن</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1.5 text-white/40">
                  <IoRocketOutline size={14} />
                  <span className="text-[10px] font-medium">توصيل سريع</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Customer Form */}
          <div className="lg:col-span-2">
            <CustomerForm
              total={total}
              itemCount={count}
              initialData={customer}
              installmentMonths={installmentMonths}
              onSubmit={(info: CustomerInfo) => {
                setCustomer(info);
                router.push("/checkout");
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

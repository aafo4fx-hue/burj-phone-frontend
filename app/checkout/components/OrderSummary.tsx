"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoReceiptOutline, IoRocketOutline, IoWalletOutline } from "react-icons/io5";

const SAR = () => (
  <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block w-[27px] h-[27px]" />
);

const fmt = (n: number) => n.toLocaleString("en-US");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  const isPaying = downPayment > 0 ? downPayment : total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#090D54] via-[#611FA0] to-[#7A2FCC] rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-[0_12px_40px_rgba(133,67,192,0.25)] max-w-md sm:max-w-none mx-auto sm:mx-0"
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#A842E4]/20 rounded-full blur-xl" />
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-lg" />

      <div className="relative space-y-2.5 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-2.5 pb-2 sm:pb-3 border-b border-white/10">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center">
            <IoReceiptOutline size={15} className="text-white/80 sm:hidden" />
            <IoReceiptOutline size={18} className="text-white/80 hidden sm:block" />
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold">ملخص الطلب</h3>
        </div>

        {/* Rows */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-white/50 font-medium">مجموع السلة</span>
            <span className="text-xs sm:text-sm font-bold">{fmt(total)} <span className="text-[10px] sm:text-xs text-white/40"><SAR /></span></span>
          </div>

          {downPayment > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-white/50 font-medium">الدفعة الأولى</span>
              <span className="text-xs sm:text-sm font-bold text-[#A842E4]">{fmt(downPayment)} <span className="text-[10px] sm:text-xs text-white/40"><SAR /></span></span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-white/50">
              <IoRocketOutline size={13} />
              <span className="text-xs sm:text-sm font-medium">التوصيل</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#A842E4] bg-[#A842E4]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">مجاني</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-2 sm:pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <IoWalletOutline size={16} className="text-[#A842E4]" />
              <span className="font-bold text-xs sm:text-sm">المطلوب دفعه الآن</span>
            </div>
            <div className="text-left">
              <span className="text-lg sm:text-2xl font-extrabold">{fmt(isPaying)}</span>
              <span className="text-[10px] sm:text-xs text-white/40 mr-1"><SAR /></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

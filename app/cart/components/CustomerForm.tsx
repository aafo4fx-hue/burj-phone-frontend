"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoPersonOutline, IoCardOutline, IoCallOutline, IoLocationOutline, IoCalendarOutline, IoWalletOutline, IoChevronDown } from "react-icons/io5";
import type { CustomerInfo } from "../../store/cartStore";

const SAR = () => (
  <Image src="/money-icon.webp" alt="ر.س" width={27} height={27} className="inline-block w-[27px] h-[27px]" />
);

const fmt = (n: number) => n.toLocaleString("en-US");

function Field({ label, icon, error, children }: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
        {icon}
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

function OrderBugPopup({ whatsapp, onClose }: { whatsapp: string; onClose: () => void }) {
  const wa = whatsapp.startsWith("0") ? "966" + whatsapp.slice(1) : whatsapp;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" dir="rtl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#090D54] via-[#611FA0] to-[#7A2FCC] px-6 pt-7 pb-5 text-center relative">
          <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all">
            <span className="text-lg leading-none">&times;</span>
          </button>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="text-3xl">🛠️</span>
          </div>
          <h2 className="text-white font-extrabold text-lg">خدمة الدفع غير متاحة</h2>
          <p className="text-white/60 text-xs mt-1">نعمل على تفعيلها قريباً</p>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-center">
          <p className="text-gray-600 text-sm leading-7">
            الدفع الإلكتروني غير متاح حالياً.<br />
            <span className="font-bold text-gray-800">سيتم الدفع عند الاستلام.</span><br />
            سنتواصل معك على نفس رقم الواتساب لتأكيد الطلب وترتيب التوصيل.
          </p>
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm shadow-[0_8px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.4)] transition-shadow"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            تواصل معنا على واتساب
          </a>
          <button onClick={onClose} className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors">
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const maxMonths = installmentMonths ?? 24;
  const MONTHS_OPTIONS = Array.from({ length: maxMonths }, (_, i) => i + 1);
  const minDownPayment = 1000 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [months, setMonths] = useState(initialData?.months ?? maxMonths);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const downPayment = minDownPayment + downPaymentExtra;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const monthlyPayment = useMemo(() => {
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return { index: i + 1, date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, amount: monthlyPayment };
    });
  }, [months, monthlyPayment]);

  const inputClass = (field: string) =>
    `w-full rounded-xl px-4 py-3 text-sm text-gray-800 bg-[#f9f5ff]/50 border focus:outline-none transition-all duration-200 placeholder:text-gray-300 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30"
        : "border-[#8543C0]/10 focus:border-[#8543C0] focus:ring-2 focus:ring-[#8543C0]/10 focus:bg-white"
    }`;

  const selectClass = "w-full rounded-xl px-4 py-3 text-sm font-bold text-gray-800 bg-[#f9f5ff]/50 border border-[#8543C0]/10 focus:outline-none focus:border-[#8543C0] focus:ring-2 focus:ring-[#8543C0]/10 focus:bg-white transition-all duration-200 cursor-pointer appearance-none";

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "مطلوب";
    if (!nationalId.trim()) newErrors.nationalId = "مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) newErrors.nationalId = "رقم هوية غير صحيح، يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام";
    if (!whatsapp.trim()) newErrors.whatsapp = "مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) newErrors.whatsapp = "رقم غير صحيح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) newErrors.address = "مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      document.getElementById(`field-${firstError}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setShowPopup(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
      {/* Customer Info Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 space-y-4 border border-[#8543C0]/[0.06] shadow-[0_2px_16px_rgba(133,67,192,0.05)]">
        <div className="flex items-center gap-2 pb-2 border-b border-[#8543C0]/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/10 flex items-center justify-center">
            <IoPersonOutline size={16} className="text-[#8543C0]" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-800">بيانات العميل</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="الاسم كاملاً" icon={<IoPersonOutline size={12} className="text-[#8543C0]" />} error={errors.name}>
            <input id="field-name" value={name} onChange={(e) => { setName(e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors((p) => ({ ...p, name: "" })); }} placeholder="محمد أحمد" className={inputClass("name")} />
          </Field>
          <Field label="رقم الهوية / الإقامة" icon={<IoCardOutline size={12} className="text-[#8543C0]" />} error={errors.nationalId}>
            <input id="field-nationalId" value={nationalId} inputMode="numeric" onChange={(e) => { setNationalId(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, nationalId: "" })); }} placeholder="1XXXXXXXXX" maxLength={10} className={inputClass("nationalId")} />
          </Field>
          <Field label="رقم الواتساب" icon={<IoCallOutline size={12} className="text-[#8543C0]" />} error={errors.whatsapp}>
            <input id="field-whatsapp" type="tel" inputMode="numeric" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, whatsapp: "" })); }} placeholder="05XXXXXXXX" className={inputClass("whatsapp")} />
          </Field>
          <Field label="العنوان" icon={<IoLocationOutline size={12} className="text-[#8543C0]" />} error={errors.address}>
            <input id="field-address" value={address} onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }} placeholder="المدينة - الحي - الشارع" className={inputClass("address")} />
          </Field>
        </div>
      </div>

      {showPopup && <OrderBugPopup whatsapp={whatsapp} onClose={() => setShowPopup(false)} />}

      {/* Payment Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 space-y-5 border border-[#8543C0]/[0.06] shadow-[0_2px_16px_rgba(133,67,192,0.05)]">
        <div className="flex items-center gap-2 pb-2 border-b border-[#8543C0]/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A842E4]/10 to-[#7A2FCC]/10 flex items-center justify-center">
            <IoWalletOutline size={16} className="text-[#A842E4]" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-800">طريقة الدفع</h3>
        </div>
        {/* Bug Notice */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-amber-500 text-base mt-0.5">🛠️</span>
          <p className="text-amber-700 text-[11px] font-medium leading-relaxed">
            خدمة الدفع الإلكتروني غير متاحة حالياً — سيتم الدفع عند الاستلام وسنتواصل معك لتأكيد الطلب
          </p>
        </div>

        <div className="space-y-4">
              {/* Months Selector */}
              <Field label="عدد الأشهر" icon={<IoCalendarOutline size={12} className="text-[#8543C0]" />}>
                <div className="relative">
                  <select
                    value={String(months)}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className={selectClass}
                  >
                    {MONTHS_OPTIONS.map((m) => (<option key={m} value={m}>{m} شهر</option>))}
                  </select>
                  <IoChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </Field>

              {/* Down Payment */}
              <Field label="الدفعة الأولى" icon={<IoWalletOutline size={12} className="text-[#8543C0]" />}>
                <div className="relative">
                  <select value={String(downPaymentExtra)} onChange={(e) => setDownPaymentExtra(Number(e.target.value))} className={selectClass}>
                    {DOWN_PAYMENT_OPTIONS.map((v) => (<option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>))}
                    <option value={total - minDownPayment}>الدفع بالكامل ({fmt(total)} ر.س )</option>
                  </select>
                  <IoChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </Field>

              {/* Monthly Payment Highlight */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#090D54] via-[#611FA0] to-[#7A2FCC] rounded-xl p-4">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#A842E4]/20 rounded-full -translate-x-8 -translate-y-8 blur-xl" />
                <div className="relative">
                  <p className="text-xs text-white/50 font-bold mb-1">القسط الشهري</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">{fmt(monthlyPayment)}</span>
                    <span className="text-sm font-medium text-white/40"><SAR /> / شهر</span>
                  </div>
                </div>
              </div>

              {/* Schedule Table */}
              {months > 0 && (
                <div className="rounded-xl overflow-hidden border border-[#8543C0]/[0.08]">
                  <div className="max-h-64 overflow-y-auto scrollbar-hide">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gradient-to-r from-[#090D54] via-[#611FA0] to-[#7A2FCC]">
                          <th className="py-2.5 px-3 text-right text-xs font-bold text-white/80">#</th>
                          <th className="py-2.5 px-3 text-right text-xs font-bold text-white/80">التاريخ</th>
                          <th className="py-2.5 px-3 text-right text-xs font-bold text-white/80">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row, i) => (
                          <tr key={row.index} className={`${i % 2 === 0 ? "bg-white" : "bg-[#f9f5ff]/50"} hover:bg-[#8543C0]/[0.03] transition-colors`}>
                            <td className="py-2.5 px-3 text-gray-400 font-bold text-xs">{row.index}</td>
                            <td className="py-2.5 px-3 text-gray-600 text-xs">{row.date}</td>
                            <td className="py-2.5 px-3 font-bold text-[#7A2FCC] text-xs">{fmt(row.amount)} <SAR /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#7A2FCC] via-[#8543C0] to-[#A842E4] text-white font-bold py-4 rounded-2xl text-sm shadow-[0_8px_30px_rgba(133,67,192,0.35)] hover:shadow-[0_12px_40px_rgba(133,67,192,0.45)] transition-shadow duration-300"
      >
        <span className="relative z-10">تأكيد الطلب</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
      </motion.button>


    </motion.div>
  );
}

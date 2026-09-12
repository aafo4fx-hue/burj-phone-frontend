"use client";

import { useState } from "react";
import {
  IoCheckmarkCircle,
  IoLogoWhatsapp,
  IoWarning,
} from "react-icons/io5";
import { inp } from "./types";
import { Err } from "./Err";

const MODELS = [
  { value: "iphone-18-pro-max", label: "آيفون 18 برو ماكس" },
  { value: "iphone-18-pro", label: "آيفون 18 برو" },
];

const STORAGE_PRICES: Record<string, { storage: string; price: number }[]> = {
  "iphone-18-pro-max": [
    { storage: "256GB", price: 6299 },
    { storage: "512GB", price: 7299 },
    { storage: "1TB", price: 8299 },
    { storage: "2TB", price: 9500 },
  ],
  "iphone-18-pro": [
    { storage: "256GB", price: 5999 },
    { storage: "512GB", price: 6999 },
    { storage: "1TB", price: 7999 },
    { storage: "2TB", price: 8500 },
  ],
};

const COLORS = [
  { value: "Burgundy", label: "برجاندي", code: "#800020" },
  { value: "Glacier", label: "جليدي", code: "#DCE6F0" },
  { value: "Silver", label: "فضي", code: "#E8E8E8" },
  { value: "Black", label: "أسود", code: "#1a1a1a" },
];

export function StepInfo({
  onNext,
  onBack,
}: {
  formData?: { firstName: string; lastName: string; phone: string; email: string };
  onChange?: (data: { firstName?: string; lastName?: string; phone?: string; email?: string }) => void;
  onNext: (data: { firstName: string; lastName: string; phone: string; email: string; model: string; color: string; storage: string }) => void;
  onBack?: () => void;
}) {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [storage, setStorage] = useState("");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    if (field === "model") return value ? "" : "اختر الموديل";
    if (field === "color") return value ? "" : "اختر اللون";
    if (field === "storage") return value ? "" : "اختر السعة";
    if (field === "name") {
      if (!value.trim()) return "الاسم مطلوب";
      if (value.trim().length < 3) return "الاسم قصير جداً";
    }
    if (field === "nationalId") {
      if (!value) return "رقم الهوية مطلوب";
      if (!/^[12]/.test(value)) return "الهوية تبدأ بـ 1 أو 2 فقط";
      if (value.length < 10) return `${value.length}/10 أرقام`;
    }
    if (field === "whatsapp") {
      if (!value) return "رقم الواتساب مطلوب";
      if (!value.startsWith("05")) return "الرقم يجب أن يبدأ بـ 05";
      if (value.length < 10) return `${value.length}/10 أرقام`;
    }
    return "";
  };

  const errors = {
    model: touched.model ? validateField("model", model) : "",
    color: touched.color ? validateField("color", color) : "",
    storage: touched.storage ? validateField("storage", storage) : "",
    name: touched.name ? validateField("name", name) : "",
    nationalId: touched.nationalId
      ? validateField("nationalId", nationalId)
      : "",
    whatsapp: touched.whatsapp ? validateField("whatsapp", whatsapp) : "",
  };

  const isValid = (f: string, v: string) =>
    touched[f] && !validateField(f, v);

  const submit = () => {
    setTouched({ model: true, color: true, storage: true, name: true, nationalId: true, whatsapp: true });
    const e = ["model", "color", "storage", "name", "nationalId", "whatsapp"].map((f) =>
      validateField(
        f,
        { model, color, storage, name, nationalId, whatsapp }[f as keyof typeof errors] ?? ""
      )
    );
    if (e.every((v) => !v)) onNext({ firstName: name.trim(), lastName: "", phone: whatsapp, email: "", model, color, storage });
  };

  const fieldClass = (field: string, value: string) => {
    if (!touched[field]) return inp;
    return validateField(field, value)
      ? "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 transition bg-red-50"
      : "w-full border border-green-400 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 transition bg-green-50";
  };

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Model Select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">اختر الموديل</label>
        <select
          className={`${touched.model && !model ? "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none bg-red-50" : model ? "w-full border border-green-400 rounded-xl px-3 py-2.5 text-sm outline-none bg-green-50" : inp} appearance-none`}
          value={model}
          onChange={(e) => { setModel(e.target.value); setTouched((p) => ({ ...p, model: true })); }}
          onBlur={() => setTouched((p) => ({ ...p, model: true }))}
        >
          <option value="">— اختر الموديل —</option>
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <Err msg={errors.model} />
      </div>

      {/* Color Select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">اختر اللون</label>
        <select
          className={`${touched.color && !color ? "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none bg-red-50" : color ? "w-full border border-green-400 rounded-xl px-3 py-2.5 text-sm outline-none bg-green-50" : inp} appearance-none`}
          value={color}
          onChange={(e) => { setColor(e.target.value); setTouched((p) => ({ ...p, color: true })); }}
          onBlur={() => setTouched((p) => ({ ...p, color: true }))}
        >
          <option value="">— اختر اللون —</option>
          {COLORS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {color && (
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="w-4 h-4 rounded-full border border-gray-200 inline-block"
              style={{ backgroundColor: COLORS.find((c) => c.value === color)?.code }}
            />
            <span className="text-xs text-gray-500">{COLORS.find((c) => c.value === color)?.label}</span>
          </div>
        )}
        <Err msg={errors.color} />
      </div>

      {/* Storage Select */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">اختر السعة</label>
        <select
          className={`${touched.storage && !storage ? "w-full border border-red-300 rounded-xl px-3 py-2.5 text-sm outline-none bg-red-50" : storage ? "w-full border border-green-400 rounded-xl px-3 py-2.5 text-sm outline-none bg-green-50" : inp} appearance-none`}
          value={storage}
          disabled={!model}
          onChange={(e) => { setStorage(e.target.value); setTouched((p) => ({ ...p, storage: true })); }}
          onBlur={() => setTouched((p) => ({ ...p, storage: true }))}
        >
          <option value="">{model ? "— اختر السعة —" : "اختر الموديل أولاً"}</option>
          {(STORAGE_PRICES[model] ?? []).map((s) => (
            <option key={s.storage} value={s.storage}>
              {s.storage} — {s.price.toLocaleString("en-US")} ر.س
            </option>
          ))}
        </select>
        <Err msg={errors.storage} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">الاسم الكامل</label>
        <div className="relative">
          <input
            className={fieldClass("name", name)}
            placeholder="محمد عبدالله"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setTouched((p) => ({ ...p, name: true }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          />
          {isValid("name", name) && (
            <IoCheckmarkCircle
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
        <Err msg={errors.name} />
      </div>

      {/* National ID */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">
          رقم الهوية الوطنية
        </label>
        <div className="relative">
          <input
            className={fieldClass("nationalId", nationalId)}
            placeholder="1xxxxxxxxx"
            value={nationalId}
            inputMode="numeric"
            dir="ltr"
            onChange={(e) => {
              const v = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);
              setNationalId(v);
              setTouched((p) => ({ ...p, nationalId: true }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, nationalId: true }))}
          />
          {isValid("nationalId", nationalId) && (
            <IoCheckmarkCircle
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
        <Err msg={errors.nationalId} />
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
          <IoLogoWhatsapp size={13} className="text-green-500" />
          رقم الواتساب
        </label>
        <div className="relative">
          <input
            className={fieldClass("whatsapp", whatsapp)}
            placeholder="05xxxxxxxx"
            value={whatsapp}
            inputMode="tel"
            dir="ltr"
            onChange={(e) => {
              const v = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);
              setWhatsapp(v);
              setTouched((p) => ({ ...p, whatsapp: true }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, whatsapp: true }))}
          />
          {isValid("whatsapp", whatsapp) && (
            <IoCheckmarkCircle
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
        <Err msg={errors.whatsapp} />
        <div
          className="flex items-start gap-2 mt-1 p-2.5 rounded-xl border"
          style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
        >
          <IoWarning size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <span className="font-bold">تنبيه:</span> رقم الواتساب هو وسيلة
            التواصل الوحيدة معك. تأكد من صحته.
          </p>
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full py-3 rounded-xl font-bold text-white text-sm mt-1"
        style={{ background: "linear-gradient(135deg, #7A2FCC, #A842E4)" }}
      >
        المتابعة للدفع
      </button>
      <button
        onClick={onBack}
        className="text-xs text-gray-400 text-center py-1 hover:text-gray-600 transition"
      >
        → تعديل الاختيار
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { IoCheckmarkCircle, IoInformationCircleOutline, IoHardwareChipOutline, IoCameraOutline, IoBatteryChargingOutline, IoPhonePortraitOutline, IoWifiOutline, IoColorPaletteOutline } from "react-icons/io5";
import { HiOutlineIdentification, HiOutlineCreditCard, HiOutlineClipboardDocumentCheck, HiOutlinePencilSquare, HiOutlineCalendarDays } from "react-icons/hi2";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabelMap: Record<string, string> = {
  modelName: "اسم الموديل", modelNumber: "رقم الموديل", condition: "الحالة",
  colorName: "اللون", edition: "الإصدار", os: "نظام التشغيل",
  processorNumber: "المعالج", processorName: "الشركة المصنعة", coreCount: "عدد الأنوية",
  ram: "ذاكرة الرام", internalStorage: "سعة التخزين", memoryType: "نوع الذاكرة",
  screenSize: "حجم الشاشة", mainCamera: "الكاميرا الرئيسية", mainCameraFeature: "نوع الكاميرا",
  secondaryCameraResolution: "الكاميرا الأمامية", flash: "الفلاش", batterySize: "حجم البطارية",
  fastCharging: "الشحن السريع", chargingType: "نوع الشحن", networkType: "نوع الشبكة",
  simCount: "عدد الشرائح", simType: "نوع الشريحة", audioJack: "منفذ الصوت",
  voiceDialing: "الاتصال الصوتي",
};

// Group specs by category
function getSpecIcon(key: string) {
  if (["processorNumber", "processorName", "coreCount", "ram", "memoryType"].includes(key)) return IoHardwareChipOutline;
  if (["mainCamera", "mainCameraFeature", "secondaryCameraResolution", "flash"].includes(key)) return IoCameraOutline;
  if (["batterySize", "fastCharging", "chargingType"].includes(key)) return IoBatteryChargingOutline;
  if (["screenSize", "internalStorage"].includes(key)) return IoPhonePortraitOutline;
  if (["networkType", "simCount", "simType", "audioJack", "voiceDialing"].includes(key)) return IoWifiOutline;
  if (["colorName", "edition", "condition"].includes(key)) return IoColorPaletteOutline;
  return IoInformationCircleOutline;
}

const oldSpecLabels: [keyof NonNullable<Product["specs"]>, string][] = [
  ["screen", "الشاشة"], ["processor", "المعالج"], ["ram", "الرام"], ["storage", "التخزين"],
  ["rearCamera", "الكاميرا الخلفية"], ["frontCamera", "الكاميرا الأمامية"],
  ["battery", "البطارية"], ["batteryLife", "عمر البطارية"], ["charging", "الشحن"],
  ["os", "نظام التشغيل"], ["extras", "مميزات إضافية"],
];

interface Props {
  overview?: string;
  detailedSpecs?: Record<string, string>;
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
  image?: string;
  productName?: string;
}

type Tab = "overview" | "specs" | "installment";

export default function ProductSpecs({ overview, detailedSpecs, installment, description, specs, image, productName }: Props) {
  const hasOverview = !!(overview && overview.length > 10);
  const hasDesc = !!(description && description.length > 5);
  const hasDetailedSpecs = !!(detailedSpecs && Object.keys(detailedSpecs).length > 0);
  const hasOldSpecs = !!(specs && Object.values(specs).some(Boolean));
  const hasInstallment = !!installment?.available;

  const overviewText = hasOverview ? overview! : hasDesc ? description! : "";
  const specEntries = hasDetailedSpecs ? Object.entries(detailedSpecs!).filter(([, v]) => !!v) : [];
  const oldSpecEntries = hasOldSpecs ? oldSpecLabels.filter(([key]) => !!specs![key]) : [];
  const hasSpecs = specEntries.length > 0 || oldSpecEntries.length > 0;

  const tabs: { key: Tab; label: string; icon: string }[] = [];
  if (overviewText) tabs.push({ key: "overview", label: "نظرة عامة", icon: "📋" });
  if (hasSpecs) tabs.push({ key: "specs", label: "المواصفات", icon: "⚙️" });
  if (hasInstallment) tabs.push({ key: "installment", label: "التقسيط", icon: "💳" });

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]?.key || "overview");

  if (!overviewText && !hasSpecs && !hasInstallment) return null;

  return (
    <div className="mt-8 space-y-5">
      {/* ── Section Title ── */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#8543C0] to-[#A842E4]" />
        <h2 className="text-lg sm:text-xl font-black text-gray-900">تفاصيل المنتج</h2>
      </div>

      {/* ── Tab Switcher ── */}
      {tabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === key
                  ? "bg-gradient-to-r from-[#7A2FCC] to-[#8543C0] text-white shadow-md shadow-[#8543C0]/20"
                  : "bg-white border border-[#8543C0]/10 text-gray-600 hover:border-[#8543C0]/30"
              }`}
            >
              <span className="text-sm">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {activeTab === "overview" && overviewText && (
        <div className="space-y-4">
          {/* Overview Card with Image */}
          <div className="relative rounded-2xl overflow-hidden">
            {image ? (
              <>
                <div className="relative min-h-[260px] sm:min-h-[340px]">
                  <Image
                    src={image}
                    alt={productName || ""}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D54]/90 via-[#090D54]/50 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-5 sm:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-sm">📋</span>
                      <span className="text-xs font-bold text-white/70 uppercase tracking-wider">نظرة عامة</span>
                    </div>
                    <p className="text-[13px] sm:text-[15px] leading-[2] text-white/90 max-w-xl">
                      {overviewText}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-[#8543C0]/5 via-white to-[#A842E4]/5 rounded-2xl border border-[#8543C0]/8 p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#8543C0]/8 flex items-center justify-center text-sm">📋</span>
                  <span className="text-sm font-bold text-[#7A2FCC]">نظرة عامة</span>
                </div>
                <p className="text-[13px] sm:text-[15px] leading-[2] text-gray-700">
                  {overviewText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════ SPECS TAB ══════════ */}
      {activeTab === "specs" && hasSpecs && (
        <div className="space-y-3">
          {specEntries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {specEntries.map(([key, value], i) => {
                const Icon = getSpecIcon(key);
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 bg-white rounded-xl border border-[#8543C0]/6 p-3.5 hover:border-[#8543C0]/15 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8543C0]/8 to-[#A842E4]/5 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#7A2FCC]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{specLabelMap[key] || key}</p>
                      <p className="text-[12px] sm:text-[13px] font-bold text-gray-900 truncate">{value}</p>
                    </div>
                    {i < 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8543C0]/20 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {oldSpecEntries.map(([key, label], i) => (
                <div
                  key={key}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#8543C0]/6 p-3.5 hover:border-[#8543C0]/15 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8543C0]/8 to-[#A842E4]/5 flex items-center justify-center shrink-0">
                    <IoInformationCircleOutline size={18} className="text-[#7A2FCC]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium">{label}</p>
                    <p className="text-[12px] sm:text-[13px] font-bold text-gray-900 truncate">{specs![key]}</p>
                  </div>
                  {i < 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8543C0]/20 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════ INSTALLMENT TAB ══════════ */}
      {activeTab === "installment" && hasInstallment && (
        <div className="space-y-4">
          {/* Installment Hero */}
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #090D54 0%, #611FA0 40%, #7A2FCC 70%, #8543C0 100%)' }}>
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#A842E4]/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#090D54]/30 rounded-full blur-[60px]" />
            </div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">تقسيط مريح</h3>
                  <p className="text-xs text-white/50">بدون فوائد</p>
                </div>
              </div>
              {installment!.downPayment && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">الدفعة المقدمة</span>
                    <span className="text-xl font-black text-white">{fmt(installment!.downPayment)} <span className="text-sm font-medium text-white/60">ر.س</span></span>
                  </div>
                </div>
              )}
              {installment!.note && (
                <p className="text-[11px] text-white/40 mt-3 text-center">{installment!.note}</p>
              )}
            </div>
          </div>

          {/* Requirements Steps */}
          <div className="bg-white rounded-2xl border border-[#8543C0]/8 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-md bg-[#8543C0]/8 flex items-center justify-center">
                <span className="text-xs">📝</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900">شروط التقسيط</h4>
            </div>
            <div className="space-y-0">
              {[
                { text: "مواطن سعودي او مقيم بإقامة سارية", icon: HiOutlineIdentification },
                { text: "سداد الدفعة المقدمة لتأكيد الطلب", icon: HiOutlineCreditCard },
                { text: "تقديم بيانات صحيحة للتواصل", icon: HiOutlineClipboardDocumentCheck },
                { text: "توقيع عقد الأقساط عند الاستلام", icon: HiOutlinePencilSquare },
                { text: "الالتزام بسداد القسط في موعده", icon: HiOutlineCalendarDays },
              ].map((item, i, arr) => (
                <div key={i} className="flex gap-3">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8543C0]/10 to-[#A842E4]/5 border border-[#8543C0]/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[#7A2FCC]" />
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-[2px] h-6 bg-gradient-to-b from-[#8543C0]/15 to-transparent my-1" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="pt-1.5 pb-4">
                    <span className="text-[13px] font-medium text-gray-700">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy */}
          {installment!.policy && (
            <div className="text-center">
              <span className="inline-block text-xs font-semibold text-[#7A2FCC] bg-[#8543C0]/5 border border-[#8543C0]/10 px-5 py-2.5 rounded-full">
                {installment!.policy}
              </span>
            </div>
          )}

          {/* Extra Conditions */}
          {installment!.conditions && installment!.conditions.length > 0 && (
            <div className="bg-[#8543C0]/3 rounded-2xl border border-[#8543C0]/8 p-4 sm:p-5">
              <h4 className="text-[13px] font-bold text-gray-800 mb-3">شروط إضافية</h4>
              <div className="space-y-2">
                {installment!.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-gray-600">
                    <IoCheckmarkCircle size={15} className="text-[#8543C0] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

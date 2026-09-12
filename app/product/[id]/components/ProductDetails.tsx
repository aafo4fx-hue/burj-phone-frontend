"use client";

import { useState, useRef, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiOutlineIdentification, HiOutlineCreditCard, HiOutlineClipboardDocumentCheck, HiOutlinePencilSquare, HiOutlineCalendarDays } from "react-icons/hi2";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabelMap: Record<string, string> = {
  modelName: "اسم الموديل",
  modelNumber: "رقم الموديل",
  condition: "الحالة",
  colorName: "اللون",
  edition: "الإصدار",
  os: "نظام التشغيل",
  processorNumber: "المعالج",
  processorName: "الشركة المصنعة",
  coreCount: "عدد الأنوية",
  ram: "ذاكرة الرام",
  internalStorage: "سعة التخزين",
  memoryType: "نوع الذاكرة",
  screenSize: "حجم الشاشة",
  mainCamera: "الكاميرا الرئيسية",
  mainCameraFeature: "نوع الكاميرا",
  secondaryCameraResolution: "الكاميرا الأمامية",
  flash: "الفلاش",
  batterySize: "حجم البطارية",
  fastCharging: "الشحن السريع",
  chargingType: "نوع الشحن",
  networkType: "نوع الشبكة",
  simCount: "عدد الشرائح",
  simType: "نوع الشريحة",
  audioJack: "منفذ الصوت",
  voiceDialing: "الاتصال الصوتي",
};

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

type TabKey = "overview" | "specs";

/* ── 3D Tilt Card ── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)", transition: "transform 0.15s ease" });

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setStyle({ transform: `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02,1.02,1.02)`, transition: "transform 0.15s ease" });
  };

  const handleLeave = () => {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)", transition: "transform 0.5s ease" });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={style} className={className}>
      {children}
    </div>
  );
}

/* ── Requirement Card ── */
function ReqCard({ item }: { item: { text: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; num: string } }) {
  return (
    <TiltCard className="cursor-default h-full">
      <div className="group relative h-full bg-white rounded-2xl sm:rounded-[22px] overflow-hidden product-card-shadow">
        {/* Mobile: horizontal row | Desktop: vertical card */}
        <div className="flex items-center gap-3.5 p-3.5 sm:flex-col sm:items-center sm:text-center sm:gap-0 sm:p-5 sm:pt-6">
          {/* Icon */}
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 sm:mb-3.5 transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: `${item.color}0c` }}
          >
            <item.icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: item.color }} />
          </div>

          {/* Text + num */}
          <div className="flex-1 min-w-0 sm:flex-none">
            <p className="text-xs sm:text-[13px] font-semibold text-gray-800 leading-[1.6] sm:leading-[1.8]">{item.text}</p>
          </div>

          {/* Mobile: step number on the left */}
          <span className="text-[10px] font-bold text-gray-300 sm:hidden shrink-0">{item.num}</span>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}08 0%, transparent 70%)` }} />

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${item.color}35, transparent)` }} />
      </div>
    </TiltCard>
  );
}

/* ── Requirements Section ── */
function RequirementsSection() {
  const items = [
    { text: "مواطن سعودي او مقيم بإقامة سارية", icon: HiOutlineIdentification, color: "#0F4C6E", num: "01" },
    { text: "سداد الدفعة المقدمة لتأكيد الطلب", icon: HiOutlineCreditCard, color: "#7CC043", num: "02" },
    { text: "تقديم بيانات صحيحة للتواصل والمتابعة", icon: HiOutlineClipboardDocumentCheck, color: "#1F6F8B", num: "03" },
    { text: "توقيع عقد الأقساط عند الاستلام", icon: HiOutlinePencilSquare, color: "#0F4C6E", num: "04" },
    { text: "الالتزام بسداد القسط الشهري في موعده", icon: HiOutlineCalendarDays, color: "#7CC043", num: "05" },
  ];

  return (
    <div className="mt-6 sm:mt-10 md:mt-14">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <span className="inline-block text-[10px] sm:text-xs font-bold text-[#0F4C6E] bg-[#0F4C6E]/5 px-4 py-1.5 rounded-full mb-3 tracking-wide">
          شروط التقسيط
        </span>
        <h2 className="text-lg sm:text-2xl md:text-[28px] font-bold text-gray-900">
          الشروط الواجب توفرها للتقديم
        </h2>
      </div>

      {/* Mobile: stacked list | Desktop: 2 rows (3 + 2 centered) */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {items.map((item, i) => <ReqCard key={i} item={item} />)}
      </div>

      <div className="hidden sm:block space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {items.slice(0, 3).map((item, i) => <ReqCard key={i} item={item} />)}
        </div>
        {/* Row 2 centered */}
        <div className="grid grid-cols-2 gap-4 max-w-[66.666%] mx-auto">
          {items.slice(3).map((item, i) => <ReqCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails({ overview, detailedSpecs, installment, description, specs, image, productName }: Props) {
  const hasOverview = !!(overview && overview.length > 10);
  const hasDesc = !!(description && description.length > 5);
  const hasDetailedSpecs = !!(detailedSpecs && Object.keys(detailedSpecs).length > 0);
  const hasOldSpecs = !!(specs && Object.values(specs).some(Boolean));
  const hasInstallment = !!installment?.available;

  const overviewText = hasOverview ? overview! : hasDesc ? description! : "";

  const specEntries = hasDetailedSpecs ? Object.entries(detailedSpecs!).filter(([, v]) => !!v) : [];
  const oldSpecEntries = hasOldSpecs ? oldSpecLabels.filter(([key]) => !!specs![key]) : [];

  const hasSpecs = specEntries.length > 0 || oldSpecEntries.length > 0;

  // Build available tabs
  const tabs: { key: TabKey; label: string }[] = [];
  if (overviewText) tabs.push({ key: "overview", label: "نظرة عامة" });

  if (hasSpecs) tabs.push({ key: "specs", label: "المواصفات التقنية" });

  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]?.key || "overview");

  const hasAnything = overviewText || hasSpecs || hasInstallment;
  if (!hasAnything) return null;

  return (
    <div className="mt-8 sm:mt-12 md:mt-20 px-1 sm:px-0">

      {/* ── TAB NAVIGATION ── */}
      {tabs.length > 1 && (
        <div className="border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-8 md:gap-12 min-w-max">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-4 text-sm sm:text-base font-semibold transition-all cursor-pointer border-b-2 ${
                  activeTab === key
                    ? "border-[#0F4C6E] text-[#0F4C6E]"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && overviewText && (
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[400px] md:min-h-[450px]">
          {/* Background Image */}
          {image && (
            <Image
              src={image}
              alt={productName || "صورة المنتج"}
              fill
              className="object-cover object-center"
              priority
              unoptimized
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full min-h-[320px] sm:min-h-[400px] md:min-h-[450px] p-5 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold text-white leading-[1.3] mb-2 sm:mb-3">
              نظرة عامة
            </h2>
            <p className="text-[13px] sm:text-[15px] md:text-lg leading-[1.8] sm:leading-[1.9] text-white/80 max-w-2xl">
              {overviewText}
            </p>
          </div>
        </div>
      )}

      {/* ── REQUIREMENTS SECTION ── */}
      {activeTab === "overview" && overviewText && <RequirementsSection />}


      {/* ── SPECS TAB ── */}
      {activeTab === "specs" && hasSpecs && (
        <div className="pd-apple-card p-4 sm:p-8 md:p-12">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-gray-900 leading-[1.3] mb-5 sm:mb-8">
            المواصفات التقنية
          </h2>
          {specEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-10 md:gap-x-12">
              {(() => {
                const mid = Math.ceil(specEntries.length / 2);
                return [specEntries.slice(0, mid), specEntries.slice(mid)].map((col, colIdx) => (
                  <div key={colIdx} className="space-y-0">
                    {col.map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2.5 sm:py-3.5 border-b border-gray-100 gap-3">
                        <span className="text-gray-400 text-xs sm:text-sm md:text-[15px] shrink-0">{specLabelMap[key] || key}</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-[15px] text-left">{value}</span>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-10 md:gap-x-12">
              {(() => {
                const mid = Math.ceil(oldSpecEntries.length / 2);
                return [oldSpecEntries.slice(0, mid), oldSpecEntries.slice(mid)].map((col, colIdx) => (
                  <div key={colIdx} className="space-y-0">
                    {col.map(([key, label]) => (
                      <div key={key} className="flex justify-between py-2.5 sm:py-3.5 border-b border-gray-100 gap-3">
                        <span className="text-gray-400 text-xs sm:text-sm md:text-[15px] shrink-0">{label}</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-[15px] text-left">{specs![key]}</span>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

      {/* ── INSTALLMENT (always visible below tabs) ── */}
      {hasInstallment && (
        <div className="mt-6 sm:mt-10 md:mt-14 space-y-3 sm:space-y-4">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a3f] via-[#0F4C6E] to-[#1a5c3a]" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-[#7CC043]/15 rounded-full blur-[60px] sm:blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full blur-[40px] sm:blur-[60px]" />
            </div>
            <div className="relative p-5 sm:p-8 md:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-5 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">💳</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2">احصل عليه بالتقسيط المريح</h3>
              {installment!.downPayment && (
                <p className="text-sm sm:text-base text-white/60">
                  ادفع مقدم <span className="text-white font-bold">{fmt(installment!.downPayment)} ر.س</span> والباقي أقساط شهرية
                </p>
              )}
              {installment!.note && <p className="text-[10px] sm:text-xs text-white/40 mt-2 sm:mt-3">{installment!.note}</p>}
            </div>
          </div>

          {installment!.policy && (
            <div className="text-center">
              <span className="inline-block text-sm font-semibold text-[#0F4C6E] bg-[#0F4C6E]/5 border border-[#0F4C6E]/10 px-6 py-3 rounded-full">
                {installment!.policy}
              </span>
            </div>
          )}

          {installment!.conditions && installment!.conditions.length > 0 && (
            <div className="pd-apple-card p-4 sm:p-6 md:p-8">
              <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-5">الشروط المطلوبة للتقديم</h4>
              <div className="space-y-3">
                {installment!.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <IoCheckmarkCircle size={18} className="text-[#7CC043] shrink-0 mt-0.5" />
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

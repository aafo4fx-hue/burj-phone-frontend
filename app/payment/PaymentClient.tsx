"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import ContactSection from "../components/ContactSection";

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const IconMada = () => (
  <Image src="/mada975b.png" alt="مدى" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />
);
const IconVisa = () => (
  <Image src="/cc975b.png" alt="بطاقات ائتمان" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />
);
const IconInstallment = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="36" height="32" rx="4"/>
    <path d="M16 24h16M16 30h10"/>
    <path d="M24 8v4M16 8v4M32 8v4"/>
    <circle cx="34" cy="30" r="5" fill="currentColor" fillOpacity=".15" stroke="currentColor"/>
    <path d="M32 30l1.5 1.5L35 28.5" strokeWidth="1.5"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4l16 6v12c0 9-7 17-16 20C8 39 1 31 1 22V10l16-6z" fill="currentColor" fillOpacity=".1"/>
    <path d="M17 24l5 5 9-10"/>
  </svg>
);
const IconCurrency = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/>
    <path d="M24 10v28M18 16h9a5 5 0 010 10h-9v-10zM18 26h10a5 5 0 010 10h-10"/>
  </svg>
);
const IconShipping = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="28" height="20" rx="2"/>
    <path d="M30 20h8l6 8v6h-14V20z"/>
    <circle cx="12" cy="36" r="4"/>
    <circle cx="36" cy="36" r="4"/>
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/>
    <line x1="24" y1="16" x2="24" y2="16" strokeWidth="3"/>
    <line x1="24" y1="22" x2="24" y2="34"/>
  </svg>
);

const paymentMethods = [
  { title: "بطاقة مدى", desc: "ادفع بسهولة عبر بطاقة مدى المحلية.", imgBg: true, Icon: IconMada },
  { title: "بطاقات الائتمان", desc: "نقبل فيزا وماستركارد وجميع البطاقات الائتمانية.", imgBg: true, Icon: IconVisa },
  { title: "الأقساط", desc: "اشتري الآن وادفع على دفعات شهرية مريحة بدون فوائد.", imgBg: false, Icon: IconInstallment },
];

const sections = [
  { title: "الدفع المعتمد", Icon: IconShield, content: ["يتم توفير طرق دفع متعددة وآمنة تناسب احتياجات العملاء."] },
  { title: "العملة المستخدمة", Icon: IconCurrency, content: ["العملة الرسمية المستخدمة في جميع المعاملات هي الريال السعودي (SAR)."] },
  { title: "التحويل والشحن", Icon: IconShipping, content: ["يتم تنسيق الشحن بعد تأكيد الطلب حسب بيانات العميل."] },
  { title: "ملاحظة هامة", Icon: IconInfo, content: ["نحرص في مؤسسة تبارك التقنية الذكية على توفير تجربة دفع واضحة وآمنة.", "بعد إتمام الطلب سيتم مراجعة البيانات والتواصل مع العميل عند الحاجة لتأكيد التفاصيل أو استكمال إجراءات الطلب."] },
];

interface Company { phone?: string; whatsapp?: string; email?: string; [k: string]: string | undefined; }

export default function PaymentClient({ company }: { company: Company }) {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);

  const anim = (delay: number) => ({
    style: {
      opacity: heroVisible ? 1 : 0,
      transform: heroVisible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    },
  });

  return (
    <main className="min-h-screen overflow-x-hidden" dir="rtl" style={{ background: "linear-gradient(180deg, #f9f7fc 0%, #f3eef9 50%, #f9f7fc 100%)" }}>

      {/* ══ HERO ══ */}
      <section className="relative w-full overflow-hidden cat-hero">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-72 h-72 sm:w-[550px] sm:h-[550px] rounded-full bg-[#A842E4]/10 blur-[80px]" />
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-[#8543C0]/8 blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-[700px] h-28 sm:h-44 bg-[#090D54]/20 blur-[60px]" />
        </div>
        {/* Grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative w-full px-4 sm:px-10 lg:px-20 py-16 sm:py-28 lg:py-36 text-center text-white">
          <div {...anim(80)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 text-[11px] sm:text-sm font-medium text-purple-100 mb-5 sm:mb-7">
            <span className="w-2 h-2 rounded-full bg-[#A842E4] animate-pulse shadow-[0_0_8px_#A842E4]" />
            مؤسسة تبارك التقنية الذكية
          </div>
          <h1 {...anim(200)} className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight">
            وسائل الدفع
            <span className="block mt-1 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #d8b4fe, #ffffff, #c084fc)" }}>الآمنة والمتاحة</span>
          </h1>
          <p {...anim(340)} className="text-purple-100/80 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            طرق دفع متعددة وآمنة تناسب احتياجات عملائنا
          </p>

          {/* Floating cards decoration */}
          <div {...anim(500)} className="flex items-center justify-center gap-3 mt-8 sm:mt-12">
            {["مدى", "فيزا", "ماستركارد"].map((t, i) => (
              <div key={t} className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm font-bold text-white/90" style={{ animationDelay: `${i * 200}ms` }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-10 sm:h-16" preserveAspectRatio="none">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f9f7fc" />
          </svg>
        </div>
      </section>

      {/* ══ PAYMENT METHODS ══ */}
      <section className="w-full px-4 sm:px-8 lg:px-20 pt-8 sm:pt-14 pb-4">
        <FadeUp>
          <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 mb-2">
            طرق الدفع المتاحة
          </h2>
          <p className="text-center text-xs sm:text-sm text-gray-500 mb-8 sm:mb-12">اختر الطريقة الأنسب لك</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {paymentMethods.map((m, i) => (
            <FadeUp key={m.title} delay={i * 120}>
              <div className="group relative bg-white rounded-3xl border border-purple-100/50 p-6 sm:p-8 text-center overflow-hidden hover:shadow-[0_8px_40px_rgba(133,67,192,0.12)] hover:-translate-y-1.5 transition-all duration-400 h-full flex flex-col items-center">
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-b-full bg-gradient-to-l from-[#8543C0] via-[#A842E4] to-[#7A2FCC] opacity-60 group-hover:opacity-100 transition-opacity" />
                {/* Hover glow */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-[#A842E4]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 ${
                  m.imgBg ? "bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-3" : "bg-gradient-to-br from-[#8543C0] to-[#611FA0] text-white"
                }`}>
                  <m.Icon />
                </div>
                <p className="text-sm sm:text-base font-extrabold text-gray-800 mb-2">{m.title}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ INFO SECTIONS ══ */}
      <section className="w-full px-4 sm:px-8 lg:px-20 py-8 sm:py-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {sections.map((s, i) => (
            <FadeUp key={s.title} delay={i * 100}>
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-purple-50 overflow-hidden hover:shadow-[0_6px_32px_rgba(133,67,192,0.1)] transition-all duration-300 h-full">
                {/* Side accent */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#A842E4] via-[#8543C0] to-[#611FA0] rounded-l-full opacity-40 group-hover:opacity-100 transition-opacity" />

                <div className="p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#8543C0] to-[#7A2FCC] flex items-center justify-center text-white shrink-0 shadow-[0_4px_16px_rgba(133,67,192,0.25)] group-hover:scale-105 transition-transform duration-300">
                      <s.Icon />
                    </div>
                    <h3 className="text-sm sm:text-lg font-extrabold text-gray-800">{s.title}</h3>
                  </div>
                  <div className="space-y-2 pr-1">
                    {s.content.map((p, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed text-xs sm:text-sm">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <div className="mt-8 sm:mt-12">
          <ContactSection
            title="التواصل بخصوص الدفع"
            phone={company.phone}
            whatsapp={company.whatsapp}
            email={company.email}
            fadeDelay={300}
          />
        </div>
      </section>

      <div className="h-10 sm:h-16" />
    </main>
  );
}

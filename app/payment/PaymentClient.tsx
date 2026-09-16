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

const paymentMethods = [
  {
    title: "بطاقة مدى",
    desc: "ادفع بسهولة عبر بطاقة مدى المحلية.",
    img: true,
    Icon: () => <Image src="/mada975b.png" alt="مدى" width={72} height={44} quality={100} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />,
  },
  {
    title: "بطاقات الائتمان",
    desc: "نقبل فيزا وماستركارد وجميع البطاقات الائتمانية.",
    img: true,
    Icon: () => <Image src="/cc975b.png" alt="بطاقات ائتمان" width={72} height={44} quality={100} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />,
  },
  {
    title: "الأقساط",
    desc: "اشتري الآن وادفع على دفعات شهرية مريحة بدون فوائد.",
    img: false,
    Icon: () => (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="36" height="32" rx="4"/>
        <path d="M16 24h16M16 30h10"/>
        <path d="M24 8v4M16 8v4M32 8v4"/>
        <circle cx="34" cy="30" r="5" fill="currentColor" fillOpacity=".15"/>
        <path d="M32 30l1.5 1.5L35 28.5" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

const infoCards = [
  {
    title: "الدفع المعتمد",
    text: "يتم توفير طرق دفع متعددة وآمنة تناسب احتياجات العملاء.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: "العملة المستخدمة",
    text: "العملة الرسمية في جميع المعاملات هي الريال السعودي (SAR).",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 5v14M9 8h4.5a2.5 2.5 0 010 5H9v-5zM9 13h5a2.5 2.5 0 010 5H9"/>
      </svg>
    ),
  },
  {
    title: "التحويل والشحن",
    text: "يتم تنسيق الشحن بعد تأكيد الطلب حسب بيانات العميل.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="7" width="14" height="10" rx="1"/>
        <path d="M15 9h4l3 4v3h-7V9z"/>
        <circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
      </svg>
    ),
  },
  {
    title: "ملاحظة هامة",
    text: "نحرص في مؤسسة برج المبدع للتقنية على توفير تجربة دفع واضحة وآمنة. بعد إتمام الطلب سيتم مراجعة البيانات والتواصل مع العميل عند الحاجة.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2.5"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
      </svg>
    ),
  },
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

      {/* ── Notice Banner ── */}
      <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-amber-700 text-xs font-semibold">
        <span>🛠️</span>
        خدمة الدفع الإلكتروني غير متاحة حالياً — سيتم الدفع عند الاستلام وسنتواصل معك لتأكيد الطلب
      </div>

      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden cat-hero">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-72 h-72 sm:w-[550px] sm:h-[550px] rounded-full bg-[#A842E4]/10 blur-[80px]" />
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-[#8543C0]/8 blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 sm:w-[700px] h-28 sm:h-44 bg-[#090D54]/20 blur-[60px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative w-full px-5 sm:px-12 lg:px-20 py-16 sm:py-28 text-center text-white">
          <div {...anim(80)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 text-[11px] sm:text-sm font-medium text-purple-100 mb-5 sm:mb-7">
            <span className="w-2 h-2 rounded-full bg-[#A842E4] animate-pulse shadow-[0_0_8px_#A842E4]" />
            مؤسسة برج المبدع للتقنية
          </div>
          <h1 {...anim(200)} className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight">
            وسائل الدفع
            <span className="block mt-1 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #d8b4fe, #ffffff, #c084fc)" }}>
              الآمنة والمتاحة
            </span>
          </h1>
          <p {...anim(340)} className="text-purple-100/80 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            طرق دفع متعددة وآمنة تناسب احتياجات عملائنا
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-10 sm:h-16" preserveAspectRatio="none">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="#f9f7fc" />
          </svg>
        </div>
      </section>

      {/* ── Payment Methods ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-6">
        <FadeUp>
          <p className="text-center text-[11px] sm:text-xs font-semibold text-[#8543C0] uppercase tracking-widest mb-2">طرق الدفع</p>
          <h2 className="text-center text-xl sm:text-2xl font-black text-gray-800 mb-8 sm:mb-12">اختر الطريقة الأنسب لك</h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {paymentMethods.map((m, i) => (
            <FadeUp key={m.title} delay={i * 100}>
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-purple-50 p-6 sm:p-8 text-center overflow-hidden hover:shadow-[0_8px_40px_rgba(133,67,192,0.12)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-l from-[#8543C0] via-[#A842E4] to-[#7A2FCC] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 ${m.img ? "bg-gray-50 border border-gray-100 p-3" : "bg-gradient-to-br from-[#8543C0] to-[#611FA0] text-white shadow-[0_4px_16px_rgba(133,67,192,0.3)]"}`}>
                  <m.Icon />
                </div>
                <p className="text-sm sm:text-base font-extrabold text-gray-800 mb-2">{m.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Info Cards ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {infoCards.map((s, i) => (
            <FadeUp key={s.title} delay={i * 80}>
              <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-purple-50 overflow-hidden hover:shadow-[0_6px_32px_rgba(133,67,192,0.1)] transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#A842E4] via-[#8543C0] to-[#611FA0] opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#8543C0] to-[#7A2FCC] flex items-center justify-center text-white shrink-0 shadow-[0_4px_16px_rgba(133,67,192,0.25)] group-hover:scale-105 transition-transform duration-300">
                      <s.Icon />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-gray-800">{s.title}</h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-xs sm:text-sm pr-1">{s.text}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <ContactSection
          title="التواصل بخصوص الدفع"
          phone={company.phone}
          whatsapp={company.whatsapp}
          email={company.email}
          fadeDelay={300}
        />
      </section>

    </main>
  );
}

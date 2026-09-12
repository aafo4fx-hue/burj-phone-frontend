"use client";
import { useEffect, useRef, useState } from "react";
import { Package, Clock, Ban, XCircle, MessageCircle, FileText, CheckCircle, RotateCcw } from "lucide-react";
import ContactSection from "../components/ContactSection";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Data ── */
const policies = [
  {
    Icon: Package,
    title: "حالة المنتج",
    color: "from-[#0F4C6E] to-[#1F6F8B]",
    content: "يشترط أن يكون المنتج في حالته الأصلية وغير مستخدم، مع الحفاظ على التغليف والملحقات والفاتورة إن وجدت.",
  },
  {
    Icon: Clock,
    title: "مدة طلب الاسترجاع",
    color: "from-[#1F6F8B] to-[#0a3550]",
    content: "يتم تقديم طلبات الاستبدال أو الاسترجاع خلال المدة المحددة حسب سياسة المتجر، وبعد مراجعة حالة الطلب والمنتج.",
  },
  {
    Icon: Ban,
    title: "المنتجات غير القابلة للاسترجاع",
    color: "from-[#0a3550] to-[#0F4C6E]",
    content: "بعض المنتجات قد لا تكون قابلة للاسترجاع أو الاستبدال بعد فتحها أو استخدامها، وخاصة المنتجات الشخصية أو الرقمية أو التي تم تجهيزها بطلب خاص.",
  },
  {
    Icon: XCircle,
    title: "إلغاء الطلبات",
    color: "from-[#7CC043] to-[#5a9030]",
    content: "يمكن إلغاء الطلب قبل التجهيز أو الشحن، أما إذا تم شحن الطلب فيتم التعامل معه وفق سياسة الاسترجاع المعتمدة.",
  },
];

const steps = [
  { Icon: MessageCircle, text: "تواصل معنا عبر الواتساب أو البريد" },
  { Icon: FileText, text: "أرسل رقم الطلب وسبب الاسترجاع" },
  { Icon: CheckCircle, text: "انتظر موافقة الفريق خلال ٢٤ ساعة" },
  { Icon: RotateCcw, text: "أعد المنتج بحالته الأصلية واستلم المبلغ" },
];

type Company = { whatsapp?: string; email?: string; phone?: string };

export default function ReturnPolicyClient() {
  const [heroReady, setHeroReady] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => { setTimeout(() => setHeroReady(true), 80); }, []);
  useEffect(() => {
    fetch("/api/admin/company").then(r => r.json()).then(setCompany).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f7fb] overflow-x-hidden" dir="rtl">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "conic-gradient(from 160deg at 30% 70%, #0a3550, #0F4C6E, #1F6F8B, #0F4C6E, #0a3550)" }} />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-56 h-56 border border-white/[0.08] rounded-3xl rotate-12" style={{ animation: "spin 30s linear infinite" }} />
          <div className="absolute bottom-[20%] right-[8%] w-40 h-40 border border-white/[0.06] rounded-full" style={{ animation: "spin 20s linear infinite reverse" }} />
          <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-[#7CC043] rounded-full opacity-50" style={{ animation: "pulse 2.5s ease-in-out infinite" }} />
          <div className="absolute bottom-[40%] left-[30%] w-2 h-2 bg-[#B8D8EC] rounded-full opacity-40" style={{ animation: "pulse 3s ease-in-out infinite 1s" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 28px)" }} />
        </div>

        <div className="relative z-10 text-center px-6 py-20">
          <div style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "scale(1)" : "scale(0.9)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 100ms" }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs sm:text-sm text-[#B8D8EC] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CC043] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7CC043]" />
              </span>
              الشروط والسياسات
            </div>
          </div>

          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 250ms" }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.2]">
            سياسة الاستبدال
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#B8D8EC] via-white to-[#7CC043]">والاسترجاع</span>
          </h1>

          <p style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(.16,1,.3,1) 450ms" }}
            className="text-[#B8D8EC]/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mt-4">
            نحرص على حقوقك — تعرّف على شروط الاسترجاع والاستبدال
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-14 sm:h-20" preserveAspectRatio="none">
            <path d="M0,40 C480,80 960,0 1440,50 L1440,80 L0,80 Z" fill="#f0f7fb" />
          </svg>
        </div>
      </section>

      {/* ════════ POLICY CARDS ════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 -mt-4 sm:-mt-6 relative z-20 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {policies.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="group h-full bg-white rounded-2xl sm:rounded-3xl border border-[#B8D8EC]/30 shadow-sm hover:shadow-xl hover:shadow-[#0F4C6E]/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                <div className={`h-1.5 w-full bg-gradient-to-l ${p.color}`} />
                <div className="p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <p.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-[15px] sm:text-lg font-bold text-[#0a3550]">{p.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-[1.85] text-[13px] sm:text-[15px]">{p.content}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════ STEPS ════════ */}
      <Reveal>
        <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-14">
          <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0a3550 0%, #0F4C6E 50%, #1F6F8B 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
            <div className="relative p-7 sm:p-12">
              <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-2">خطوات الاسترجاع</h3>
              <p className="text-[#B8D8EC]/60 text-xs sm:text-sm text-center mb-8">اتبع الخطوات التالية لإتمام طلب الاسترجاع</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((s, i) => (
                  <div key={i} className="relative bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/[0.12] transition-colors duration-300">
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#7CC043] flex items-center justify-center text-white text-xs font-black shadow-md">
                      {i + 1}
                    </div>
                    <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                      <s.Icon className="w-5 h-5 text-[#B8D8EC]" strokeWidth={2} />
                    </div>
                    <p className="text-white/90 text-[13px] sm:text-sm font-medium leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ════════ CONTACT ════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <ContactSection
          title="التواصل بخصوص الطلبات"
          phone={company?.phone}
          whatsapp={company?.whatsapp}
          email={company?.email}
          fadeDelay={200}
        />
      </section>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Shield, Headphones, Percent, Truck, Building2, Target, Star, ChevronLeft } from "lucide-react";
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
const features = [
  { Icon: Shield, value: "١٠٠٪", label: "ضمان الجودة", color: "from-[#0F4C6E] to-[#1F6F8B]" },
  { Icon: Headphones, value: "٢٤/٧", label: "دعم فني متواصل", color: "from-[#1F6F8B] to-[#0a3550]" },
  { Icon: Percent, value: "٠٪", label: "بدون فوائد", color: "from-[#7CC043] to-[#5a9030]" },
  { Icon: Truck, value: "سريع", label: "توصيل فوري", color: "from-[#0a3550] to-[#0F4C6E]" },
];

const sections = [
  {
    Icon: Building2,
    title: "من نحن",
    color: "from-[#0F4C6E] to-[#1F6F8B]",
    paragraphs: [
      "مؤسسة تبارك التقنية الذكية هي متجر إلكتروني متخصص في تقديم المنتجات والخدمات بجودة عالية وتجربة شراء سهلة وآمنة تناسب احتياجات العملاء.",
      "نحرص على توفير أفضل الحلول والعروض مع الاهتمام بالتفاصيل التي تمنح العميل تجربة احترافية بداية من تصفح المنتجات وحتى إتمام الطلب.",
      "اختيارك الأول لشراء أحدث الأجهزة الإلكترونية بأقساط سهلة وبدون فوائد، مع دعم فني وضمان يخليك واثق إنك تتعامل مع متجر يحط رضاك فوق كل اعتبار.",
    ],
  },
  {
    Icon: Target,
    title: "رؤيتنا",
    color: "from-[#1F6F8B] to-[#0a3550]",
    paragraphs: [
      "تقديم تجربة تسوق إلكترونية موثوقة وسريعة ومريحة، مع الحفاظ على أعلى معايير الجودة وخدمة العملاء.",
    ],
  },
  {
    Icon: Star,
    title: "رسالتنا",
    color: "from-[#7CC043] to-[#5a9030]",
    paragraphs: [
      "نسعى إلى بناء ثقة طويلة الأمد مع عملائنا من خلال منتجات مميزة، دعم سريع، وشفافية كاملة في التعامل.",
    ],
  },
];

export default function AboutClient() {
  const [heroReady, setHeroReady] = useState(false);
  const [company, setCompany] = useState<{ whatsapp?: string; email?: string; addressAr?: string } | null>(null);

  useEffect(() => { setTimeout(() => setHeroReady(true), 80); }, []);
  useEffect(() => {
    fetch("/api/admin/company").then(r => r.json()).then(d => setCompany(d)).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#f0f7fb] overflow-x-hidden" dir="rtl">

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[420px] sm:min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "conic-gradient(from 220deg at 70% 30%, #0a3550, #0F4C6E, #1F6F8B, #0F4C6E, #0a3550)" }} />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-72 h-72 border border-white/10 rounded-full" style={{ animation: "spin 25s linear infinite" }} />
          <div className="absolute bottom-[15%] left-[8%] w-48 h-48 border border-white/[0.07] rounded-full" style={{ animation: "spin 18s linear infinite reverse" }} />
          <div className="absolute top-[40%] left-[20%] w-3 h-3 bg-[#7CC043] rounded-full opacity-60" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          <div className="absolute top-[25%] right-[30%] w-2 h-2 bg-[#B8D8EC] rounded-full opacity-50" style={{ animation: "pulse 3s ease-in-out infinite 0.5s" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 30px)" }} />
        </div>

        <div className="relative z-10 text-center px-6 py-20">
          <div style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "scale(1)" : "scale(0.9)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 100ms" }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-xs sm:text-sm text-[#B8D8EC] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CC043] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7CC043]" />
              </span>
              تعرّف علينا
            </div>
          </div>

          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(.16,1,.3,1) 250ms" }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.2]">
            مؤسسة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#B8D8EC] via-white to-[#7CC043]">تبارك</span>
            <br />
            <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-[#B8D8EC]/80 mt-2 inline-block">التقنية الذكية</span>
          </h1>

          <p style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(.16,1,.3,1) 450ms" }}
            className="text-[#B8D8EC]/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mt-4">
            نقدّم لك تجربة تسوّق إلكترونية فريدة بأعلى معايير الجودة والثقة
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" className="w-full h-14 sm:h-20" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,80 1440,20 L1440,80 L0,80 Z" fill="#f0f7fb" />
          </svg>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20">
        <Reveal>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-[#0F4C6E]/5 border border-[#B8D8EC]/30 p-5 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((f, i) => (
                <div key={f.label} className="group text-center p-3 sm:p-5 rounded-2xl hover:bg-[#f0f7fb] transition-colors duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    <f.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-[#0a3550]">{f.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════ CONTENT SECTIONS ════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 right-[23px] sm:right-[31px] w-[2px] bg-gradient-to-b from-[#0F4C6E] via-[#1F6F8B] to-[#7CC043] rounded-full opacity-15" />

          <div className="space-y-8 sm:space-y-12">
            {sections.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="relative flex gap-5 sm:gap-7">
                  {/* Timeline icon */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl border border-[#B8D8EC]/30 shadow-sm hover:shadow-lg hover:shadow-[#0F4C6E]/5 transition-all duration-500 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-l ${item.color}`} />
                    <div className="p-5 sm:p-8">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0a3550] mb-3 sm:mb-5">{item.title}</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {item.paragraphs.map((p, j) => (
                          <p key={j} className="text-gray-600 leading-[1.85] text-[13px] sm:text-[15px]">{p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHY US ════════ */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-14">
          <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0a3550 0%, #0F4C6E 50%, #1F6F8B 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <div className="relative p-8 sm:p-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white text-center mb-3">لماذا تختارنا؟</h3>
              <p className="text-[#B8D8EC]/70 text-xs sm:text-sm text-center max-w-lg mx-auto mb-8">
                نجمع بين الجودة والسعر المناسب مع خدمة عملاء استثنائية
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { Icon: Shield, text: "منتجات أصلية ١٠٠٪" },
                  { Icon: Truck, text: "شحن سريع لجميع المناطق" },
                  { Icon: Headphones, text: "دعم فني على مدار الساعة" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/[0.1] transition-colors duration-300">
                    <div className="w-9 h-9 rounded-lg bg-[#7CC043]/20 flex items-center justify-center shrink-0">
                      <item.Icon className="w-4 h-4 text-[#7CC043]" strokeWidth={2.2} />
                    </div>
                    <span className="text-white/90 text-sm font-medium">{item.text}</span>
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
          title="وسائل التواصل"
          phone={company?.whatsapp}
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

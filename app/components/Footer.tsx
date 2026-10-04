import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope } from "react-icons/fa";


const API = process.env.BACKEND_URL || "https://burj-phone-backend.onrender.com";

async function getCompany() {
  try {
    const r = await fetch(`${API}/api/admin/company`, {
      // Was revalidate:0 — that opts the entire homepage OUT of ISR/Full Route Cache,
      // causing server-side execution on every request. Changed to 3600 to match
      // layout.tsx and page.tsx so all three calls share the same Next.js Data Cache
      // entry and are deduplicated within the same render cycle.
      next: { revalidate: 18000, tags: ["company"] },
    });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const c = await getCompany();

  function ensureAbsolute(url: string) {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  }

  function toInlineUrl(url: string) {
    if (!url) return url;
    return `/view-file?url=${encodeURIComponent(url)}`;
  }

  function formatWhatsapp(phone: string) {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("05")) return `https://wa.me/966${digits.slice(1)}`;
    if (digits.startsWith("5") && digits.length === 9) return `https://wa.me/966${digits}`;
    return `https://wa.me/${digits}`;
  }

  function formatTel(phone: string) {
    const cleaned = phone.replace(/[^\d+]/g, "");
    return cleaned ? `tel:${cleaned}` : "";
  }

  const qrSrc: string = c.qrImage || "";
  const qrLink: string = ensureAbsolute(c.qrLink || "");

  const footerItems: { image: string; linkType: string; link: string; file: string }[] =
    (c.footerItems || []).filter((item: { image: string }) => item.image);

  const img1: string = c.img1 || "";
  const linkType1: string = c.link1Type || c.linkType1 || "link";
  const useFile1 = linkType1 === "file" || (!!(c.file1 || "").trim() && !(c.link1 || "").trim());
  const link1: string = useFile1 ? toInlineUrl(c.file1 || "") : ensureAbsolute(c.link1 || "");
  const img2: string = c.img2 || "";
  const linkType2: string = c.link2Type || c.linkType2 || "link";
  const useFile2 = linkType2 === "file" || (!!(c.file2 || "").trim() && !(c.link2 || "").trim());
  const link2: string = useFile2 ? toInlineUrl(c.file2 || "") : ensureAbsolute(c.link2 || "");

  function getHref(item: { linkType: string; link: string; file: string }) {
    const asFile = item.linkType === "file" || (!!(item.file || "").trim() && !(item.link || "").trim());
    return asFile ? toInlineUrl(item.file) : ensureAbsolute(item.link);
  }

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-gray-200 bg-[#f7f7f8] text-gray-700 sm:mt-20" dir="rtl">

      {/* Main Footer */}
      <div className="relative">

        <div className="relative max-w-6xl mx-auto px-5 pt-8 pb-6 sm:px-8 sm:py-12 grid grid-cols-1 md:grid-cols-[1.1fr_1.4fr] gap-6 md:gap-x-16">
          {/* من نحن */}
          <div className="space-y-3 text-center md:text-right">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600">
              {c.logo && <Image src={c.logo} alt="شعار برج المبدع" width={56} height={64} className="h-16 w-14 object-contain" />}
              <span>
                <span className="block text-xl font-extrabold tracking-tight text-gray-900">برج المبدع</span>
                <span className="mt-1 block text-xs font-medium text-violet-700">للتقنية والإلكترونيات</span>
              </span>
            </Link>
            <p className="max-w-md mx-auto md:mx-0 text-xs sm:text-sm leading-7 text-gray-500">
              {c.details || "برج المبدع للتقنية هي اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
            </p>
          </div>

          {/* روابط مهمة */}
          <div className="space-y-3">
            <h3 className="text-gray-900 font-bold text-sm flex items-center gap-2">
              اكتشف المزيد
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {[
                { label: "عن برج المبدع للتقنية", href: "/about" },
                { label: "طرق الدفع", href: "/payment" },
                { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
                { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} prefetch={true} className="group flex h-full min-h-14 items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-white px-3 py-3 text-gray-600 hover:border-violet-200 hover:text-violet-700 hover:shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
                    {label}
                    <span aria-hidden="true" className="shrink-0 text-lg text-gray-400 group-hover:text-violet-600">‹</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          {(c.whatsapp || c.phone || c.email) && <div className="space-y-3 md:col-span-2 border-t border-gray-200 pt-5">
            <h3 className="text-gray-900 font-bold text-sm flex items-center gap-2">
              تواصل معنا
            </h3>
            <ul className="flex flex-wrap gap-4 text-sm">
              {c.whatsapp && (
                <li>
                  <a href={formatWhatsapp(c.whatsapp)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-emerald-700 transition-colors group">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <FaWhatsapp className="text-emerald-700" size={15} />
                    </span>
                    <span dir="ltr">{c.whatsapp}</span>
                  </a>
                </li>
              )}
              {c.phone && (
                <li>
                  <a href={formatTel(c.phone)}
                    className="flex items-center gap-3 text-gray-600 hover:text-blue-700 transition-colors group">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <FaMobileAlt className="text-blue-700" size={15} />
                    </span>
                    <span dir="ltr">{c.phone}</span>
                  </a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-violet-700 transition-colors group">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <FaEnvelope className="text-violet-700" size={14} />
                    </span>
                    <span dir="ltr" className="min-w-0 break-all">{c.email}</span>
                  </a>
                </li>
              )}
            </ul>

          </div>}

          {/* Partners / Badges */}
          {(qrSrc || footerItems.length > 0 || img1 || img2) && <div className="md:col-span-2 border-t border-gray-200 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              <h3 className="text-xs font-bold text-gray-600">بيانات المتجر والاعتمادات</h3>
            </div>
            <div className="flex gap-4 flex-wrap items-center justify-center md:justify-start rounded-2xl border border-gray-200/80 bg-white px-4 py-3 [&_img]:max-w-full [&_a]:max-w-full">
              {qrSrc && (
                qrLink
                  ? <a href={qrLink} target="_blank" rel="noopener noreferrer">
                      <Image src={qrSrc} alt="رمز QR للتواصل" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg border border-gray-200 bg-white p-1.5 h-[50px] w-auto hover:border-purple-400/40 transition-colors" style={{ width: "auto" }} />
                    </a>
                  : <Image src={qrSrc} alt="رمز QR للتواصل" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg border border-gray-200 bg-white p-1.5 h-[50px] w-auto" style={{ width: "auto" }} />
              )}

              {footerItems.map((item, i) => {
                const href = getHref(item);
                const el = (
                  <Image key={i} src={item.image} alt={`شعار شريك ${i + 1}`} width={200} height={50} quality={85} loading="lazy"
                    className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" style={{ width: "auto" }} />
                );
                return href
                  ? <a key={i} href={href} target="_blank" rel="noopener noreferrer">{el}</a>
                  : <span key={i}>{el}</span>;
              })}

              {img1 && (
                link1
                  ? <a href={link1} target="_blank" rel="noopener noreferrer">
                      <Image src={img1} alt="وسيلة دفع معتمدة" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" style={{ width: "auto" }} />
                    </a>
                  : <Image src={img1} alt="وسيلة دفع معتمدة" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg h-[50px] w-auto" style={{ width: "auto" }} />
              )}

              {img2 && (
                link2
                  ? <a href={link2} target="_blank" rel="noopener noreferrer">
                      <Image src={img2} alt="وسيلة دفع معتمدة" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" style={{ width: "auto" }} />
                    </a>
                  : <Image src={img2} alt="وسيلة دفع معتمدة" width={200} height={50} quality={85} loading="lazy" className="object-contain rounded-lg h-[50px] w-auto" style={{ width: "auto" }} />
              )}
            </div>
          </div>}
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-gray-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-4 sm:px-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <span className="text-xs leading-6 text-center text-gray-500">
              جميع الحقوق محفوظة © 2026 برج المبدع للتقنية
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">وسائل الدفع</span>
              <Image src="/payment-methods.webp" alt="Visa Mastercard Mada" width={120} height={35} quality={85} loading="lazy" className="object-contain" style={{ width: "auto" }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { BsTruck } from "react-icons/bs";
import { RiCustomerService2Line } from "react-icons/ri";

const API = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${API}/api/admin/company`, { cache: "no-store" });
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
    <footer className="relative mt-20 overflow-hidden" dir="rtl">

      {/* Main Footer */}
      <div className="relative bg-[#1a0533]">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-violet-500/8 rounded-full blur-[80px]" />

        <div className="relative max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* من نحن */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-l from-purple-400 to-transparent rounded-full" />
              من نحن
            </h3>
            <p className="text-sm leading-7 text-gray-400">
              {c.details || "برج المبدع للتقنية هي اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
            </p>
          </div>

          {/* روابط مهمة */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-l from-purple-400 to-transparent rounded-full" />
              روابط مهمة
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "عن برج المبدع للتقنية", href: "/about" },
                { label: "طرق الدفع", href: "/payment" },
                { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
                { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-purple-300 hover:pr-2 transition-all duration-300 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-l from-purple-400 to-transparent rounded-full" />
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm">
              {c.whatsapp && (
                <li>
                  <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <FaWhatsapp className="text-emerald-400" size={15} />
                    </span>
                    <span dir="ltr">{c.whatsapp}</span>
                  </a>
                </li>
              )}
              {c.phone && (
                <li>
                  <a href={`tel:${c.phone}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <FaMobileAlt className="text-blue-400" size={15} />
                    </span>
                    <span dir="ltr">{c.phone}</span>
                  </a>
                </li>
              )}
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <FaEnvelope className="text-purple-400" size={14} />
                    </span>
                    <span dir="ltr">{c.email}</span>
                  </a>
                </li>
              )}
            </ul>

            {/* Partners / Badges */}
            <div className="flex gap-2 flex-wrap items-center justify-center md:justify-start pt-3">
              {qrSrc && (
                qrLink
                  ? <a href={qrLink} target="_blank" rel="noreferrer">
                      <Image src={qrSrc} alt="رمز QR للتواصل" width={200} height={50} className="object-contain rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-1.5 h-[50px] w-auto hover:border-purple-400/40 transition-colors" />
                    </a>
                  : <Image src={qrSrc} alt="رمز QR للتواصل" width={200} height={50} className="object-contain rounded-lg border border-white/10 bg-white/5 p-1.5 h-[50px] w-auto" />
              )}

              {footerItems.map((item, i) => {
                const href = getHref(item);
                const el = (
                  <Image key={i} src={item.image} alt={`شعار شريك ${i + 1}`} width={200} height={50}
                    className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" />
                );
                return href
                  ? <a key={i} href={href} target="_blank" rel="noreferrer">{el}</a>
                  : <span key={i}>{el}</span>;
              })}

              {img1 && (
                link1
                  ? <a href={link1} target="_blank" rel="noreferrer">
                      <Image src={img1} alt="وسيلة دفع معتمدة" width={200} height={50} className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" />
                    </a>
                  : <Image src={img1} alt="وسيلة دفع معتمدة" width={200} height={50} className="object-contain rounded-lg h-[50px] w-auto" />
              )}

              {img2 && (
                link2
                  ? <a href={link2} target="_blank" rel="noreferrer">
                      <Image src={img2} alt="وسيلة دفع معتمدة" width={200} height={50} className="object-contain rounded-lg h-[50px] w-auto hover:opacity-80 transition-opacity" />
                    </a>
                  : <Image src={img2} alt="وسيلة دفع معتمدة" width={200} height={50} className="object-contain rounded-lg h-[50px] w-auto" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              جميع الحقوق محفوظة © {new Date().getFullYear()} برج المبدع للتقنية
            </span>
            <Image src="/فيزا ماستر مدى.webp" alt="Visa Mastercard Mada" width={120} height={35} className="object-contain opacity-70 hover:opacity-100 transition-opacity" style={{ width: "auto" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fields = [
  { key: "nameAr", label: "الاسم بالعربية" },
  { key: "nameEn", label: "الاسم بالانجليزية" },
  { key: "addressAr", label: "العنوان بالعربية" },
  { key: "addressEn", label: "العنوان بالانجليزية" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "whatsapp", label: "رقم الواتساب" },
  { key: "website", label: "الرابط" },
  { key: "email", label: "الايميل" },
  { key: "currencyAr", label: "عملة البيع عربي" },
  { key: "currencyEn", label: "عملة البيع انجليزي" },
  { key: "taxNumber", label: "الرقم الضريبي" },
  { key: "shippingCompany", label: "اسم شركة الشحن" },
  { key: "paymentMethod", label: "طريقة الدفع" },
];

export const imageFields = [
  { key: "logo", label: "الشعار" },
  { key: "header", label: "الترويسة" },
  { key: "footer", label: "التذييل" },
  { key: "stamp", label: "الختم" },
  { key: "cancelStamp", label: "ختم الإلغاء" },
];

export const defaultData = {
  nameAr: "",
  nameEn: "",
  addressAr: "",
  addressEn: "",
  phone: "",
  whatsapp: "",
  website: "",
  email: "",
  currencyAr: "",
  currencyEn: "",
  taxNumber: "",
  shippingCompany: "",
  paymentMethod: "",
  details: "",
  logo: "",
  header: "",
  footer: "",
  stamp: "",
  cancelStamp: "",
};

export const toFullUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return `${API}${url}`;
};

// withCacheBust adds a stable per-session timestamp to non-Cloudinary URLs so
// the browser doesn't serve a stale local-server image, without generating a
// new URL on every React render (which would trigger an unnecessary img refetch).
// The timestamp is captured once at module load time and reused for the
// entire session — a new session always gets a fresh URL.
const _SESSION_BUST = Date.now();

export const withCacheBust = (url: string) => {
  if (!url) return url;
  if (url.includes("cloudinary.com")) return url;
  const base = url.split("?")[0];
  return `${base}?t=${_SESSION_BUST}`;
};

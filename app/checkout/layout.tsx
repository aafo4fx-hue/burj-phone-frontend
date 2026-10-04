import type { Metadata } from "next";

const BACKEND = process.env.BACKEND_URL || "https://burj-phone-backend.vercel.app";
const SITE_URL = "https://burjjstorre.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 18000 } });
    return r.ok ? r.json() : {};
  } catch { return {}; }
}

export async function generateMetadata(): Promise<Metadata> {
  const c = await getCompany();
  return {
    title: "إتمام الطلب",
    description: c.details || "أكمل عملية الشراء وادفع بأمان.",
    robots: { index: false, follow: false },
    alternates: { canonical: `${SITE_URL}/checkout` },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

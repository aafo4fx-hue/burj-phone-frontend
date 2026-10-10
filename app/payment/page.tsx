import type { Metadata } from "next";
import PaymentClient from "./PaymentClient";

const BACKEND = process.env.BACKEND_URL || "https://burj-phone-backend.onrender.com";
const SITE_URL = "https://burjjstorre.com";

// Static page - on-demand revalidation via revalidateTag("company") handles updates.
export const revalidate = false;

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, {
      next: { revalidate: 18000, tags: ["company"] },
    });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const siteName = company.nameAr || "برج المبدع للتقنية";
  const title = `وسائل الدفع | ${siteName}`;
  const description = `طرق الدفع المتاحة لدى ${siteName} - بطاقات مدى، البطاقات الائتمانية والأقساط الميسرة.`;
  const ogImageUrl = company.logo
    ? (company.logo.startsWith("http") ? company.logo : `${SITE_URL}${company.logo}`)
    : `${SITE_URL}/web-app-manifest-512x512.png`;
  return {
    title,
    description,
    keywords: ["طرق الدفع", "مدى", "فيزا", "ماستركارد", "أقساط", siteName, "السعودية"],
    openGraph: {
      type: "website",
      url: `${SITE_URL}/payment`,
      title,
      description,
      locale: "ar_SA",
      siteName,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
    alternates: { canonical: `${SITE_URL}/payment` },
  };
}

export default async function PaymentPage() {
  const company = await getCompany();
  return <PaymentClient company={company} />;
}

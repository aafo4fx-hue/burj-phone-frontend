import type { Metadata } from "next";
import ReturnPolicyClient from "./ReturnPolicyClient";

const SITE_URL = "https://burj-almubdia.com";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع",
  description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل برج المبدع للتقنية.",
  keywords: ["سياسة الاسترجاع", "استبدال", "إلغاء طلب", "برج المبدع للتقنية", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/return-policy`,
    title: "سياسة الاستبدال والاسترجاع | برج المبدع للتقنية",
    description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل برج المبدع للتقنية.",
    locale: "ar_SA",
    siteName: "برج المبدع للتقنية",
  },
  alternates: { canonical: `${SITE_URL}/return-policy` },
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyClient />;
}

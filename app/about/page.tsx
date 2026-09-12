import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const SITE_URL = "https://burj-almubdia.com";

export const metadata: Metadata = {
  title: "عن برج المبدع للتقنية",
  description: "تعرف على برج المبدع للتقنية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
  keywords: ["برج المبدع للتقنية", "عن المؤسسة", "أجهزة إلكترونية بالأقساط", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "عن برج المبدع للتقنية",
    description: "تعرف على برج المبدع للتقنية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
    locale: "ar_SA",
    siteName: "برج المبدع للتقنية",
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return <AboutClient />;
}

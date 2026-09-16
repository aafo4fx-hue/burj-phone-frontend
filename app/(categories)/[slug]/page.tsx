import type { Metadata } from "next";
import { slugConfigs } from "../../lib/categoryConfig";
import CategoryPageClient from "./CategoryPageClient";

// Pre-render all known slugs at build time (ISR).
// Eliminates the SSR Vercel Function execution for every sub-category visit —
// the page shell (metadata HTML) is served from Full Route Cache.
// Products are still fetched client-side by CategoryPageClient.
// Cache behavior: Expected from configuration, not verified by Vercel telemetry.
export const revalidate = 3600;

// Statically generate all slug paths known at build time.
// Any slug NOT in this list falls back to on-demand ISR.
export function generateStaticParams() {
  return Object.keys(slugConfigs).map((slug) => ({ slug }));
}

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://burjjstorre.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, {
      next: { revalidate: 3600, tags: ["company"] },
    });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = slugConfigs[slug];
  const company = await getCompany();

  const siteName = company.nameAr || "برج المبدع للتقنية";
  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";

  const title = parentLabel ? `${label} - ${parentLabel}` : label;
  const description = `تسوق ${label} بأفضل الأسعار وبالأقساط في ${siteName}. ${
    parentLabel ? `ضمن قسم ${parentLabel}.` : ""
  } شحن سريع وضمان معتمد.`;

  const logoUrl = company.logo
    ? company.logo.startsWith("http")
      ? company.logo
      : `${BACKEND}${company.logo}`
    : "";

  return {
    title,
    description,
    keywords: [label, parentLabel, siteName, "أقساط", "شراء", "السعودية"].filter(Boolean),
    openGraph: {
      type: "website",
      url: `${SITE_URL}/categories/${slug}`,
      title: `${title} | ${siteName}`,
      description,
      siteName,
      locale: "ar_SA",
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/categories/${slug}`,
    },
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}

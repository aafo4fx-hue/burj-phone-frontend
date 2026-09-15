import BannerSlider from "./BannerSlider";

const API = process.env.BACKEND_URL || "https://burj-phone-backend.vercel.app";

export default async function Banner() {
  let images: string[] = [];

  try {
    // Increased from 60s to 3600s (1 hour).
    // No on-demand revalidation is wired from the admin panel, so revalidate:60
    // was causing ~1,440 ISR background executions per day for data that changes
    // at most a few times per week.
    // ISR invocation reduction: 1,440/day → 24/day (Calculated).
    // Cache behavior: Expected from configuration, not verified by Vercel telemetry.
    const res = await fetch(`${API}/api/admin/banners`, { next: { revalidate: 3600 } });
    const data: { url: string; active: boolean }[] = await res.json();
    if (Array.isArray(data))
      images = data.filter((b) => b.url && b.active).map((b) => b.url.startsWith("http") ? b.url : `${API}${b.url}`);
  } catch {
    images = ["/banner1.webp", "/banner2.webp"];
  }

  if (!images.length) return (
    <section className="w-full flex justify-center py-6 px-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-200" style={{ aspectRatio: "1.8/1" }} />
    </section>
  );

  return <BannerSlider images={images} />;
}

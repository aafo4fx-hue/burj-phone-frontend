import CategorySlider from "./CategorySlider";
import { slugConfigs } from "../lib/categoryConfig";

const BACKEND = process.env.BACKEND_URL || "https://backend-burj-production.up.railway.app";

// map مباشر من اسم الفئة في الـ DB للينك الصح (نفس لينكات الـ navbar)
const categoryHrefMap: Record<string, string> = {
  // Smartphones
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "أبل آيفون 17 برو": "/smartphones/iphone-17-pro",
  "أبل آيفون 17 اير": "/smartphones/iphone-17-air",
  "أبل آيفون 17": "/smartphones/iphone-17",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "سامسونج جالاكسي S26 الترا": "/smartphones/samsung-galaxy-s26-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-galaxy-s26-plus",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  // Apple Watches
  "ساعات ابل": "/apple-watches/se",
  // Smart Watches
  "ساعات ذكية": "/smart-watches/smart-watches",
  // Audio
  "سماعات ابل": "/audio",
  "speaker": "/audio",
  "earbuds": "/audio",
  // PlayStation
  "ps5": "/playstation/ps5",
  "ps4": "/playstation/ps5-slim",
  "xbox": "/playstation/xbox-one",
  "controller": "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  // Laptops
  "ماك بوك إير": "/laptops/macbook-air",
  "laptop": "/laptops/macbook-pro",
  // Tablets
  "tablet": "/tablets/ipad-pro",
  // Accessories
  "بطاريات متنقله": "/accessories/anker-batteries",
  // Games / اكسسورات
  "اكسسورات": "/games",
  "gaming": "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  "microphone": "/games/microphones",
  "figures": "/games/figures",
  "rgb": "/games/rgb-lighting",
};

function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";

  // مطابقة مباشرة
  if (categoryHrefMap[name]) return categoryHrefMap[name];

  // مطابقة جزئية للسماعات
  if (name.toLowerCase().includes("سماعات")) return "/audio";
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";

  // fallback للـ slugConfigs
  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;
    if (config.filters.category && config.filters.category === name) return path;
    if (config.filters.nameIncludes?.some((kw) => name.toLowerCase().includes(kw.toLowerCase()))) return path;
  }

  return `/search?q=${encodeURIComponent(name)}`;
}

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, settingsRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/public`, { cache: "no-store" }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { cache: "no-store" }),
    ]);
    const allCats: Category[] = catRes.ok ? await catRes.json() : [];
    const settings: Setting[] = settingsRes.ok ? await settingsRes.json() : [];

    const orderMap = new Map(
      settings.filter((s) => s.showInHome).map((s) => [s.category, s.order])
    );

    return allCats.sort((a, b) => {
      const aHome = orderMap.has(a.name);
      const bHome = orderMap.has(b.name);
      if (aHome && !bHome) return -1;
      if (!aHome && bHome) return 1;
      if (aHome && bHome) return (orderMap.get(a.name) ?? 0) - (orderMap.get(b.name) ?? 0);
      return 0;
    });
  } catch {
    return [];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  const categoriesWithHref = categories.map((cat) => ({
    ...cat,
    href: resolveHref(cat.name),
  }));

  return (
    <div className="w-full py-8 sm:py-10" dir="rtl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 sm:h-8 rounded-full bg-gradient-to-b from-[#A842E4] to-[#611FA0]" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900">تسوق حسب الأقسام</h2>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#8543C0]/15 to-transparent" />
        </div>
      </div>
      <CategorySlider categories={categoriesWithHref} />
    </div>
  );
}

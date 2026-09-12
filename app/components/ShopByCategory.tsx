import CategorySlider from "./CategorySlider";
import ShopByCategoryClient from "./ShopByCategoryClient";
import { slugConfigs } from "../lib/categoryConfig";

const BACKEND = process.env.BACKEND_URL || "https://burj-phone-backend.vercel.app";

const IPHONE_18_CARD = {
  name: "آيفون 18",
  count: 0,
  image: "/iphone-18.webp",
  href: "/smartphones/iphone-18",
  featured: true,
};

const categoryHrefMap: Record<string, string> = {
  "ابل ايفون 18": "/smartphones/iphone-18",
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
  "ساعات ابل": "/apple-watches/se",
  "ساعات ذكية": "/smart-watches/smart-watches",
  "سماعات ابل": "/audio",
  speaker: "/audio",
  earbuds: "/audio",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  "ماك بوك إير": "/laptops/macbook-air",
  laptop: "/laptops/macbook-pro",
  tablet: "/tablets/ipad-pro",
  "بطاريات متنقله": "/accessories/anker-batteries",
  "اكسسورات": "/games",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
};

function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";
  if (categoryHrefMap[name]) return categoryHrefMap[name];
  if (name.toLowerCase().includes("سماعات")) return "/audio";
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";
  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;
    if (config.filters.category && config.filters.category === name) return path;
    if (config.filters.nameIncludes?.some((kw) => name.toLowerCase().includes(kw.toLowerCase())))
      return path;
  }
  return `/search?q=${encodeURIComponent(name)}`;
}

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<(Category & { href: string; featured?: boolean })[]> {
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

    const sorted = allCats.sort((a, b) => {
      const aHome = orderMap.has(a.name);
      const bHome = orderMap.has(b.name);
      if (aHome && !bHome) return -1;
      if (!aHome && bHome) return 1;
      if (aHome && bHome) return (orderMap.get(a.name) ?? 0) - (orderMap.get(b.name) ?? 0);
      return 0;
    });

    const withHref = sorted.map((cat) => ({ ...cat, href: resolveHref(cat.name) }));
    const without18 = withHref.filter(
      (c) => c.href !== "/smartphones/iphone-18" && c.name !== "ابل ايفون 18"
    );
    return [IPHONE_18_CARD, ...without18];
  } catch {
    return [IPHONE_18_CARD];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  return <ShopByCategoryClient categories={categories} />;
}

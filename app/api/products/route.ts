import { NextRequest } from "next/server";
import { getBackend } from "../admin/_lib";

// Route Handler-level cache — makes this route ○ Static in Next.js build output.
// Raised from 60s → 300s: CDN caches 5x longer, cutting Function invocations
// for product list requests. Product data rarely changes within 5 minutes.
// Public endpoint, no cookies, no user-specific data.
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const brand = req.nextUrl.searchParams.get("brand") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const limit = req.nextUrl.searchParams.get("limit") || "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (brand) params.set("brand", brand);
  if (category) params.set("category", category);
  if (limit) params.set("limit", limit);
  const res = await fetch(`${getBackend()}/api/products?${params.toString()}`, {
    method: "GET",
    next: { revalidate: 300 },
  });
  // Stream backend JSON directly — no parse/stringify on this Function.
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      // s-maxage=300: CDN edge caches for 5 minutes, cutting Function invocations 5x.
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

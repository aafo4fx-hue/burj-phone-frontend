import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../admin/_lib";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const brand = req.nextUrl.searchParams.get("brand") || "";
  const category = req.nextUrl.searchParams.get("category") || "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (brand) params.set("brand", brand);
  if (category) params.set("category", category);
  const res = await fetch(`${getBackend()}/api/products?${params.toString()}`, {
    ...forwardCookies(req, { method: "GET" }),
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

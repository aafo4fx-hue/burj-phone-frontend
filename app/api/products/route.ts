import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

// Verified: GET /api/products is a public endpoint with no auth middleware
// on the backend (productRoutes.js). forwardCookies was removed because:
//   1. The endpoint does not use cookies for any logic.
//   2. Sending cookies with a fetch() prevents Next.js Data Cache from
//      caching the response, defeating the revalidate:60 setting entirely.
// Double-JSON eliminated: response body is streamed directly to the client
// without parse → object → re-stringify on the Vercel Function.
// Cache behavior: Expected from configuration, not verified by Vercel telemetry.
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
    next: { revalidate: 60 },
  });
  // Stream backend JSON directly — no parse/stringify on this Function.
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

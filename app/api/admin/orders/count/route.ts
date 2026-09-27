import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

/**
 * GET /api/admin/orders/count
 *
 * Calls the dedicated lightweight /api/checkout/count endpoint which uses
 * MongoDB estimatedDocumentCount() (O(1) metadata read, 0ms execution, 0 CPU)
 * and in-memory cache on the backend.
 */
export async function GET(req: NextRequest) {
  const url = `${getBackend()}/api/checkout/count`;
  const res = await fetch(url, forwardCookies(req, { cache: "no-store" }));
  if (!res.ok) return NextResponse.json({ count: 0 }, { status: res.status });
  const data = await res.json();
  const count = typeof data.count === "number" ? data.count : 0;
  return NextResponse.json({ count });
}

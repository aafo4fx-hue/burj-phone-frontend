import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

/**
 * GET /api/admin/orders/count
 *
 * Returns only the total order count — no order documents serialised.
 * Used by AdminNavbar to show the notification badge without fetching
 * the full orders list on every polling tick.
 *
 * The backend's paginated endpoint already supports ?limit=1&page=1 and
 * returns { total, orders: [...] }. We request limit=1 so Mongoose only
 * fetches 1 document (the skip/limit path is cheap), then discard it and
 * return just the count.
 */
export async function GET(req: NextRequest) {
  const url = `${getBackend()}/api/checkout?page=1&limit=1`;
  const res = await fetch(url, forwardCookies(req, { cache: "no-store" }));
  if (!res.ok) return NextResponse.json({ count: 0 }, { status: res.status });
  const data = await res.json();
  const count = typeof data.total === "number" ? data.total : 0;
  return NextResponse.json({ count });
}

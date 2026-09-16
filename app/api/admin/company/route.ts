import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBackend, forwardCookies } from "../_lib";

export async function GET(_req: NextRequest) {
  // No cookies forwarded here — Next.js Data Cache only activates on requests
  // without varying headers (cookie/authorization). The backend GET /company
  // is intentionally public (no authMiddleware), so no cookie is needed.
  // Cache: force-cache + tags["company"] gives us persistent caching keyed by
  // tag, invalidated immediately on PUT via revalidateTag("company", "max").
  const res = await fetch(`${getBackend()}/api/admin/company`, {
    cache: "force-cache",
    next: { tags: ["company"] },
  });
  if (!res.ok) return NextResponse.json({ error: "Backend unavailable" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/company`, forwardCookies(req, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  if (!res.ok) return NextResponse.json({ error: "Backend unavailable" }, { status: res.status });
  const data = await res.json();
  // Invalidate company cache immediately after a successful update so the
  // next request for /api/company/public and the product page layout reflects
  // the new data without waiting for the 3600s TTL to expire.
  // "max" profile: stale-while-revalidate — existing in-flight requests are
  // served stale while the background revalidation runs (recommended by Next.js docs).
  revalidateTag("company", "max");
  return NextResponse.json(data, { status: res.status });
}

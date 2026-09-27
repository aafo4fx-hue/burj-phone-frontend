import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBackend, forwardCookies } from "../_lib";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch(`${getBackend()}/api/admin/company`, {
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ error: "Backend unavailable" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
  });
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
  // revalidateTag(tag, profile): In Next.js 16 "use cache" mode, revalidateTag
  // requires a second cache-life profile argument. "max" is a built-in profile
  // that sets the longest possible TTL — suitable for company data that changes
  // infrequently but must be fresh immediately after a PUT.
  revalidateTag("company", "max");
  return NextResponse.json(data, { status: res.status });
}

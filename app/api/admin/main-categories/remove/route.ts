import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBackend, forwardCookies } from "../../_lib";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/main-categories/remove`, forwardCookies(req, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  const data = await res.json();
  // ✅ FIX #1: flush category cache so removed category disappears from all cached pages
  if (res.ok) revalidateTag("main-categories", "max");
  return NextResponse.json(data, { status: res.status });
}

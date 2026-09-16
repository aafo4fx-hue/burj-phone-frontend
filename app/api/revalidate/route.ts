import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get("tag");
  // FIX #1: "layout" is not a valid cache-life profile in Next.js 16.
  // Use "max" (recommended) — serves stale content while revalidation runs
  // in the background (stale-while-revalidate). "layout" was silently
  // falling back to { expire: 0 } which blocks the next request.
  if (tag) revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: true }, { status: 200 });
}

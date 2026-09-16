import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

// Route Handler-level cache — 300s TTL.
// Public endpoint, no cookies, no auth. Full Route Cache active.
// Cache behavior: Expected from configuration, not verified by Vercel telemetry.
export const revalidate = 300;

export async function GET() {
  // Cache reviews for 5 minutes — new reviews require admin approval anyway,
  // so a short TTL is safe and prevents a DB query on every homepage visit.
  // Double-JSON eliminated: backend body is streamed directly to the client.
  // Cache behavior: Expected from configuration, not verified by Vercel telemetry.
  const res = await fetch(`${getBackend()}/api/admin/reviews`, {
    next: { revalidate: 300 },
  });
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

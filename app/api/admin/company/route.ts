import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../_lib";

export async function GET(req: NextRequest) {
  // revalidate:3600 — company data changes rarely (logo, name, contact).
  // Caches the response at the Vercel Data Cache layer for 1 hour.
  // Eliminates repeated Function executions for every new browser session
  // that triggers Navbar's fetchCompany() after localStorage TTL expires.
  // forwardCookies kept: admin panel GET /company uses this same route
  // and needs the cookie for any future auth-gated variant.
  // Cache behavior: Expected from configuration, not verified by Vercel telemetry.
  // Note: forwardCookies may prevent Data Cache from activating if the cookie
  // header varies per request — see audit notes. Navbar's Zustand persist (1h TTL)
  // is the primary defence; this revalidate is a secondary layer.
  const res = await fetch(`${getBackend()}/api/admin/company`, {
    ...forwardCookies(req, {}),
    next: { revalidate: 3600, tags: ["company"] },
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
  return NextResponse.json(data, { status: res.status });
}

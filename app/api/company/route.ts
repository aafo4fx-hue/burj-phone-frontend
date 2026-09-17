import { NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

// Cache the public company endpoint — data changes only when admin updates it
// (on-demand revalidation via revalidateTag("company") handles that).
// This prevents repeated backend round-trips for the logo/name used by Navbar.
export const revalidate = 3600;

export async function GET() {
  const res = await fetch(`${getBackend()}/api/admin/company`, {
    next: { revalidate: 3600, tags: ["company"] },
  });
  if (!res.ok) return NextResponse.json({}, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

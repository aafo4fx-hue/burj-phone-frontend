import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/api/checkout/${id}/public`);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

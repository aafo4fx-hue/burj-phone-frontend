import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [orderRes, companyRes] = await Promise.all([
    fetch(`${BACKEND}/api/checkout/${id}/public`),
    fetch(`${BACKEND}/api/admin/company`),
  ]);
  // Fallback: if public route not available yet, try fetching from orders list
  let order;
  if (orderRes.ok) {
    order = await orderRes.json();
  } else {
    const allRes = await fetch(`${BACKEND}/api/admin/orders`);
    if (!allRes.ok) return NextResponse.json({ error: "not found" }, { status: 404 });
    const all = await allRes.json();
    order = all.find((o: { _id: string }) => o._id === id);
    if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const company = await companyRes.json();
  return NextResponse.json({ order, company });
}

import type { Metadata } from "next";
import PaymentClient from "./PaymentClient";

export const metadata: Metadata = { title: "طرق الدفع" };

// Use BACKEND_URL (server-to-server) not NEXT_PUBLIC_API_URL (client-side).
// Server components should always use the internal/backend URL so the
// Next.js Data Cache activates correctly and requests don't traverse the
// public internet unnecessarily.
const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, {
      next: { revalidate: 3600, tags: ["company"] },
    });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function PaymentPage() {
  const company = await getCompany();
  return <PaymentClient company={company} />;
}

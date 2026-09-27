import { getBackend } from "../../admin/_lib";

export const revalidate = 300;

export async function GET() {
  const res = await fetch(`${getBackend()}/api/products/home`, {
    next: { revalidate: 300, tags: ["products"] },
  });
  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

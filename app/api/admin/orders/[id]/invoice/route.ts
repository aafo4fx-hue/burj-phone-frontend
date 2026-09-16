import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../../_lib";

// ---------------------------------------------------------------------------
// GET /api/admin/orders/[id]/invoice
//
// Returns { order, company } in a single response.
//
// WHY: Every document page (invoice, receipt, contract, cancellation) needs
// exactly the same two pieces of data.  Previously:
//   - invoice/cancellation pages made 2 independent fetches + N product fetches (N+1)
//   - print page made 2 independent fetches (not even parallel)
//
// Now ALL document pages call this single route which:
//   1. Fetches order and company in PARALLEL (Promise.all) — 1 round-trip
//   2. Resolves product images server-side via parallel per-item fetches
//      on the SERVER (Node.js, same datacenter as backend) — latency ~1ms
//      vs ~100ms browser→server round-trips in the old N+1 pattern.
//   3. Returns one JSON blob to the client.
//
// Net result: N+2 browser→server requests → 1 browser→server request.
// The product image lookups still happen but at server→server speed which
// is orders of magnitude cheaper from the client's perspective.
// ---------------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const backend = getBackend();
  const cookies = forwardCookies(req, {});

  // Fetch order and company in parallel — independent requests.
  const [orderRes, companyRes] = await Promise.all([
    fetch(`${backend}/api/checkout/${id}`, cookies),
    fetch(`${backend}/api/admin/company`),
  ]);

  const [order, company] = await Promise.all([
    orderRes.json(),
    companyRes.json(),
  ]);

  // Resolve product images server-side in parallel.
  // WHY: The old client-side code did sequential or uncontrolled-parallel
  // fetches from the browser, each costing a full browser→Vercel→backend
  // round-trip.  Running this on the server means Node→backend within the
  // same datacenter — typically sub-millisecond vs ~100ms from the browser.
  //
  // We cap at 10 items (sane order limit) and swallow individual failures
  // gracefully so a missing product image never breaks the whole invoice.
  if (Array.isArray(order?.items)) {
    const items = order.items.slice(0, 10);
    const withImages = await Promise.all(
      items.map(async (item: { productId?: string; image?: string }) => {
        if (!item.productId) return item;
        try {
          const pRes = await fetch(`${backend}/api/products/${item.productId}`);
          if (!pRes.ok) return item;
          const p = await pRes.json();
          return { ...item, image: p.image || p.images?.[0] || item.image || "" };
        } catch {
          return item;
        }
      })
    );
    order.items = withImages;
  }

  return NextResponse.json({ order, company }, { status: orderRes.status });
}

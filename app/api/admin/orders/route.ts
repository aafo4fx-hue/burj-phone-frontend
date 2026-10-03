import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../_lib";

export async function GET(req: NextRequest) {
  // Forward pagination + search query params to the backend so the DB does
  // the filtering/pagination instead of loading every order into JS memory.
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const url = `${getBackend()}/api/checkout${qs ? `?${qs}` : ""}`;
  try {
    const res = await fetch(url, forwardCookies(req, {}));
    const data = await res.json();
    // Pass the status through so the client knows when auth has lapsed.
    // The middleware now redirects unauthenticated browsers before they reach
    // this route, so a 401 here only happens in edge cases (token expired
    // mid-session). Return the status faithfully so the client can react.
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ orders: [], total: 0, pages: 1 }, { status: 500 });
  }
}

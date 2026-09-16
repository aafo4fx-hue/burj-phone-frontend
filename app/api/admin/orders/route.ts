import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../_lib";

export async function GET(req: NextRequest) {
  // Forward pagination + search query params to the backend so the DB does
  // the filtering/pagination instead of loading every order into JS memory.
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const url = `${getBackend()}/api/checkout${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, forwardCookies(req, {}));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

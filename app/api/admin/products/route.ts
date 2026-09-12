import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../_lib";

export async function GET(req: NextRequest) {
  const res = await fetch(`${getBackend()}/api/admin/products`, forwardCookies(req, { method: "GET" }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  const body = await req.arrayBuffer();
  const res = await fetch(`${getBackend()}/api/admin/products`, {
    ...forwardCookies(req, { method: "POST" }),
    body: Buffer.from(body),
    headers: {
      ...(forwardCookies(req, {}).headers as Record<string, string>),
      "content-type": contentType,
    },
    // @ts-expect-error duplex needed for streaming body
    duplex: "half",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

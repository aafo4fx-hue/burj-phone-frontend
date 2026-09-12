import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../../_lib";

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { ok: res.ok }; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/checkout/${id}`, {
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  return NextResponse.json(await safeJson(res), { status: res.status });
}

function buildHeaders(req: NextRequest): Record<string, string> {
  const csrf = req.headers.get("x-csrf-token") || "";
  let cookie = req.headers.get("cookie") || "";
  // Ensure csrf_token cookie is present for double-submit pattern
  if (csrf && !cookie.includes("csrf_token=")) {
    cookie = cookie ? `${cookie}; csrf_token=${csrf}` : `csrf_token=${csrf}`;
  }
  const headers: Record<string, string> = { cookie };
  if (csrf) headers["x-csrf-token"] = csrf;
  return headers;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const endpoint = body.financials ? "financials" : "status";
  const headers = { ...buildHeaders(req), "Content-Type": "application/json" };
  const res = await fetch(`${getBackend()}/api/checkout/${id}/${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  return NextResponse.json(await safeJson(res), { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/checkout/${id}`, {
    method: "DELETE",
    headers: buildHeaders(req),
  });
  return NextResponse.json(await safeJson(res), { status: res.status });
}

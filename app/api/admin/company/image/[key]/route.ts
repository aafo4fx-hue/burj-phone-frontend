import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getBackend, forwardCookies } from "../../../_lib";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const res = await fetch(
    `${getBackend()}/api/admin/company/image/${key}`,
    forwardCookies(req, { method: "DELETE" })
  );
  const data = await res.json();
  if (res.ok) revalidateTag("company", "max");
  return NextResponse.json(data, { status: res.status });
}

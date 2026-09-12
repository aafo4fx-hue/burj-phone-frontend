import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("missing url", { status: 400 });

  // fix: replace /image/upload/ with /raw/upload/ for PDF files
  const fetchUrl = url.replace("/image/upload/", "/raw/upload/").replace(/\/fl_attachment:[^/]+\//, "/");

  const res = await fetch(fetchUrl);
  if (!res.ok) return new NextResponse("failed", { status: res.status });

  const body = await res.arrayBuffer();
  const rawCt = res.headers.get("content-type") || "";
  // Force PDF content type for octet-stream or when URL hints at PDF
  const contentType =
    rawCt === "application/octet-stream" || !rawCt
      ? "application/pdf"
      : rawCt;

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

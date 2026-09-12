import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host.includes("burjj-almubdia.com")) {
    return NextResponse.redirect(
      new URL(req.nextUrl.pathname + req.nextUrl.search, "https://burj-almubdia.com"),
      301
    );
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
}

export const config = {
  matcher: ["/:path*"],
};

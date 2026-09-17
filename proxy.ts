import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host.includes("burj-almubdia.com")) {
    return NextResponse.redirect(
      new URL(req.nextUrl.pathname + req.nextUrl.search, "https://burjjstorre.com"),
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
  // Previous matcher /:path* ran on every request — including static assets,
  // images, fonts, and Next.js internals. That's pure CPU overhead with no benefit.
  //
  // New matcher covers only:
  //   1. The domain redirect (must run on all page routes)
  //   2. /admin/* routes (need token check)
  //
  // Excluded (no middleware needed):
  //   - _next/static, _next/image — CDN-served assets
  //   - favicon.ico, robots.txt, sitemap.xml, manifest.json
  //   - /api/* routes — handled by route handlers, no redirect needed
  //   - All static files in /public (images, fonts, webp)
  //
  // Using negative lookahead to exclude these paths efficiently.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|api/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|woff2?|ttf|otf|css|js|map)).*)",
  ],
};

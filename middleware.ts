import { NextRequest, NextResponse } from "next/server";

/**
 * Protects all /admin routes except /admin/login.
 *
 * Works entirely from the cookie — no backend call needed, so the middleware
 * stays fast (runs on the Edge in ~0ms). A missing or expired token redirects
 * to /admin/login before the page or API route even executes, which is why
 * the browser was previously showing 401 errors: the page loaded, fired its
 * data-fetch, and got 401 from the backend because the session was gone.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate the /admin subtree
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Allow the login page and its API route through unconditionally
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/csrf")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    // Preserve the intended destination so we can redirect back after login
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

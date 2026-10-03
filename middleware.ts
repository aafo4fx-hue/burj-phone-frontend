import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Admin route protection middleware.
 *
 * Every request to /admin/* (except /admin/login) is checked for a valid
 * admin_token cookie.  If the cookie is missing or the JWT is invalid/expired
 * the user is redirected to /admin/login so they see the login page instead
 * of a flash of protected content followed by a "session expired" toast.
 *
 * API routes under /api/admin/* are NOT redirected — they return 401 JSON so
 * the client-side code can handle them gracefully (toast + redirect).
 */

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

// Print / document pages that don't need auth chrome but still need a valid
// session (they fetch order data).  Exclude them from the redirect loop.
const PRINT_SUFFIXES = ["/print", "/receipt", "/invoice", "/contract", "/cancellation"];

function isPrintPath(pathname: string): boolean {
  return PRINT_SUFFIXES.some((s) => pathname.endsWith(s));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin UI pages — not the API routes (they handle 401 themselves).
  if (!pathname.startsWith("/admin/") && pathname !== "/admin") {
    return NextResponse.next();
  }

  // Login page and print pages are always accessible.
  if (PUBLIC_ADMIN_PATHS.includes(pathname) || isPrintPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  // Verify the JWT with the same secret the backend uses.
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // JWT_SECRET not set in this environment — let the request through and
    // let the backend API calls fail with 401 as before.
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    // Token is invalid or expired — clear the stale cookie and redirect.
    const response = redirectToLogin(req);
    response.cookies.set("admin_token", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  }
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};

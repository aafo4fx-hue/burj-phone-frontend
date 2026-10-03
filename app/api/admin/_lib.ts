import { NextRequest } from "next/server";

export function getBackend(): string {
  const url = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "https://burj-phone-backend.vercel.app";
  return url.replace(/\/$/, "");
}

export function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  const existing = init.headers as Record<string, string> | undefined;

  // Extract admin_token and send it as both a cookie header AND an
  // Authorization: Bearer header. The backend authMiddleware accepts both,
  // and this ensures auth works even when the cookie header is stripped or
  // not parsed correctly by the backend (e.g. cross-origin serverless calls).
  const tokenMatch = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  return {
    ...init,
    headers: {
      ...existing,
      ...(cookie ? { cookie } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
}

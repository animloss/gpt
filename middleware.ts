import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

const authRoutes = ["/giris", "/kayit", "/sifre-sifirla"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!session && pathname.startsWith("/panel")) {
    const url = new URL("/giris", request.url);
    return NextResponse.redirect(url);
  }

  if (!session && pathname.startsWith("/admin")) {
    const url = new URL("/giris", request.url);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const url = new URL("/panel", request.url);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    const url = new URL("/panel", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/giris", "/kayit", "/sifre-sifirla"]
};

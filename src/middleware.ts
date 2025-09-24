// ===========================================
// PATH: src/middleware.ts
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
// jwt import removed for now since we're not verifying tokens in middleware

const protectedRoutes = [
  "/dashboard",
  "/meal-plans",
  "/shopping-list",
  "/recipes", // protect recipes too
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Grab token cookie (presence is enough for now)
  const token = req.cookies.get("token");

  // 1) If logged-in user visits root (landing page), redirect to dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2) Protect routes: if no token, redirect to login
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3) Optional: later we can verify token integrity here

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // include root for redirect
    "/dashboard/:path*",
    "/meal-plans/:path*",
    "/shopping-list/:path*",
    "/recipes/:path*",
  ],
};

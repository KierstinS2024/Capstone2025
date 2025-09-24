// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
// Optional: verify token in middleware (safer)
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";

const protectedRoutes = [
  "/dashboard",
  "/meal-plans",
  "/shopping-list",
  "/recipes", // protect recipes too
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token");

  // 1) If logged in and visiting root, redirect to dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2) Protect listed routes for unauthenticated users
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional extra: verify token integrity/expiry (uncomment to enable)
  // if (token) {
  //   try {
  //     jwt.verify(token.value, JWT_SECRET);
  //   } catch (err) {
  //     // token invalid/expired — treat as unauthenticated
  //     if (protectedRoutes.some((r) => pathname.startsWith(r))) {
  //       return NextResponse.redirect(new URL("/login", req.url));
  //     }
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // include root so we can redirect logged-in users away from landing
    "/dashboard/:path*",
    "/meal-plans/:path*",
    "/shopping-list/:path*",
    "/recipes/:path*",
  ],
};

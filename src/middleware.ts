// PATH: src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

// Protect pages that require authentication
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/meal-plans") ||
    pathname.startsWith("/shopping-list")
  ) {
    const token = req.cookies.get("token"); // just check presence
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/meal-plans/:path*", "/shopping-list/:path*"],
};

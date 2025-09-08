// path: src/app/api/auth/logout/route.ts
/**
 * POST /api/auth/logout
 * --------------------
 * Logs out the current user by clearing the HttpOnly JWT cookie.
 * Returns a success message.
 */

import { NextResponse } from "next/server";

// Cookie configuration (must match login/signup)
const COOKIE_NAME = "token";
const COOKIE_PATH = "/";

export async function POST() {
  try {
    // Create a response indicating success
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the HttpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: "", // empty the cookie
      httpOnly: true, // prevent JS access
      secure: process.env.NODE_ENV === "production",
      path: COOKIE_PATH,
      maxAge: 0, // expire immediately
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Logout route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

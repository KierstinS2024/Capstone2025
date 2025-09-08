/**
 * src/app/api/auth/logout/route.ts
 * POST /api/auth/logout
 * Clears the HttpOnly JWT cookie to log out the user
 */

import { NextResponse } from "next/server";

// Must match the cookie name/path used in login
const COOKIE_NAME = "token";
const COOKIE_PATH = "/";

export async function POST() {
  try {
    // Create a response indicating success
    const response = NextResponse.json({ message: "Logged out successfully" });

    // Delete the cookie by setting maxAge to 0
    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true, // ensure client JS cannot access
      secure: process.env.NODE_ENV === "production",
      path: COOKIE_PATH,
      maxAge: 0,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

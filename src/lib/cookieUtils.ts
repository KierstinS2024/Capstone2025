// ===========================================
// PATH: src/lib/cookieUtils.ts
// ===========================================
import { NextResponse } from "next/server";

// Set JWT cookie securely
export function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true, // Client JS cannot read
    path: "/", // Available on all paths
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Clear JWT cookie (logout)
export function clearTokenCookie(res: NextResponse) {
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

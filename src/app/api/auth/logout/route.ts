// ===========================================
// PATH: src/app/api/auth/logout/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/cookieUtils";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  clearTokenCookie(res);
  return res;
}

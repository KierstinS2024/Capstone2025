// Path: src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  // TODO: Clear JWT cookie here
  return res;
}

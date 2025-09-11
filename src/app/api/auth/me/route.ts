// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUserFromDB } from "@/lib/serverAuth";

export async function GET() {
  try {
    const user = await getCurrentUserFromDB();
    return NextResponse.json(user ?? null, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}

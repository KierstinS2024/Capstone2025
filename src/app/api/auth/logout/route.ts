// src/app/api/auth/logout/route.ts
// Logs out the current user

import { NextRequest, NextResponse } from "next/server";
import { logoutAPI } from "@/lib/authHelpers";

export async function POST(_req: NextRequest) {
  try {
    await logoutAPI();
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/auth/logout error:", error);
    return NextResponse.json(
      { message: error.message || "Logout failed" },
      { status: 400 }
    );
  }
}

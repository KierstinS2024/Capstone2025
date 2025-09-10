// src/app/api/auth/me/route.ts
// Returns the current logged-in user

import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUserAPI } from "@/lib/authHelpers";
import type { User } from "@/types/user";

export async function GET(_req: NextRequest) {
  try {
    const user: User = await fetchCurrentUserAPI();
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { message: error.message || "Not authenticated" },
      { status: 401 }
    );
  }
}

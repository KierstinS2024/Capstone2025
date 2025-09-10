// src/app/api/auth/login/route.ts
// Logs in a user with email + password

import { NextRequest, NextResponse } from "next/server";
import { loginAPI } from "@/lib/authHelpers"; // helper already typed
import type { User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    const user: User = await loginAPI(email, password);
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 400 }
    );
  }
}

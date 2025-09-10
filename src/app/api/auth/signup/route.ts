// src/app/api/auth/signup/route.ts
// Creates a new user

import { NextRequest, NextResponse } from "next/server";
import { signupAPI } from "@/lib/authHelpers";
import type { User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user: User = await signupAPI(name, email, password);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 400 }
    );
  }
}

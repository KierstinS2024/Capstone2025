// path: src/app/api/auth/login/route.ts
/**
 * POST /api/auth/login
 * --------------------
 * Authenticates a user with email and password.
 * Returns a JWT in an HttpOnly cookie and a client-safe user object.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken } from "@/lib/auth";
import { User as ClientUser } from "@/types/auth";

// Cookie configuration
const COOKIE_NAME = "token";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password }: { email?: string; password?: string } =
      await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Fetch user with explicit type to fix "_id is unknown"
    const userDoc = await User.findOne({ email }).lean<{
      _id: string;
      email: string;
      password: string;
      avatarUrl?: string;
      preferences?: Record<string, any>;
    }>();

    if (!userDoc || !(await verifyPassword(password, userDoc.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: userDoc._id });

    const safeUser: ClientUser = {
      _id: userDoc._id,
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl,
      preferences: userDoc.preferences || {},
    };

    const response = NextResponse.json({ user: safeUser }, { status: 200 });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: COOKIE_PATH,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

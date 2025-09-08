/**
 * src/app/api/auth/login/route.ts
 * POST /api/auth/login
 * Logs in a user and sets an HttpOnly cookie containing a JWT
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken } from "@/lib/auth";

// Constants for cookie configuration
const COOKIE_NAME = "token";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse the request body
    const { email, password }: { email?: string; password?: string } =
      await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if password matches hashed password in DB
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = signToken({ userId: user._id.toString() });

    // Create response and set HttpOnly cookie for secure client-server authentication
    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true, // not accessible via JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      path: COOKIE_PATH,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax", // mitigates CSRF attacks
    });

    return response;
  } catch (err) {
    // Log unexpected server errors
    console.error("Login error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

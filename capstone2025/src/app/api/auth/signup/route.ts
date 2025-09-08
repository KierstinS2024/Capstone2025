/**
 * src/app/api/auth/signup/route.ts
 * POST /api/auth/signup
 * Creates a new user, hashes their password, generates a JWT,
 * and sets it in an HttpOnly cookie for authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

// Cookie configuration
const COOKIE_NAME = "token";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Parse request body
    const { email, password }: { email?: string; password?: string } =
      await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);

    // Create the new user in MongoDB
    const newUser = await User.create({ email, password: hashedPassword });

    // Generate a JWT for this user
    const token = signToken({ userId: newUser._id.toString() });

    // Create response and set HttpOnly cookie
    const response = NextResponse.json({ user: newUser }, { status: 201 });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true, // protects against XSS
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      path: COOKIE_PATH,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax", // protects against CSRF
    });

    return response;
  } catch (err) {
    // Catch and log server errors
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

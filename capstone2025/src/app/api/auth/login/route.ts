// src/app/api/auth/login/route.ts
/**
 * POST /api/auth/login
 * --------------------
 * Authenticates a user with email and password.
 * Returns a JWT in an HttpOnly cookie and a client-safe user object.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { User as ClientUser } from "@/types/auth";

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

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find the user with password included
    const userDoc = await User.findOne({ email }).select("+password");
    if (!userDoc) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Use Mongoose method to verify password
    const isValid = await userDoc.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = signToken({ userId: userDoc._id.toString() });

    // Build client-safe user object (exclude password)
    const safeUser: ClientUser = {
      _id: userDoc._id.toString(),
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl,
      preferences: userDoc.preferences || {},
    };

    // Attach cookie and respond
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

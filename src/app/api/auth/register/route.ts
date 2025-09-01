// path: src/app/api/auth/register/route.ts
/**
 * POST /api/auth/register
 *
 * Register a new user.
 * Steps:
 * 1. Validate email/password
 * 2. Check if user exists
 * 3. Hash password
 * 4. Save user
 * 5. Return JWT token and user info
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ email, passwordHash });

    const token = generateToken(newUser._id.toString());

    return NextResponse.json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        preferences: newUser.preferences,
        avatarUrl: newUser.avatarUrl,
      },
    }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

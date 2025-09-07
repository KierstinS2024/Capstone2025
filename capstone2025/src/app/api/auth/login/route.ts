// path: src/app/api/auth/login/route.ts
/**
 * POST /api/auth/login
 * Authenticates a user with email & password.
 * Returns a JWT token and user info if successful.
 * Uses bcrypt for password verification.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -----------------------------
// Types
// -----------------------------
interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseBody {
  token: string;
  user: {
    _id: string;
    email: string;
    avatarUrl?: string;
    preferences?: any;
  };
}

// -----------------------------
// Environment Variables
// -----------------------------
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Replace with secure env var
const JWT_EXPIRES_IN = "7d"; // token expiration

// -----------------------------
// POST Handler
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    // Connect to DB
    await connectToDatabase();

    // Parse request body
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Prepare user data to return (omit password)
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      avatarUrl: user.avatarUrl,
      preferences: user.preferences || {},
    };

    return NextResponse.json<LoginResponseBody>({ token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

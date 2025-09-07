// path: src/app/api/auth/signup/route.ts
/**
 * POST /api/auth/signup
 * Registers a new user with email & password.
 * Hashes the password with bcrypt and returns JWT + user info.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -----------------------------
// Types
// -----------------------------
interface SignupRequestBody {
  email: string;
  password: string;
}

interface SignupResponseBody {
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
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Use secure env var
const JWT_EXPIRES_IN = "7d";

// -----------------------------
// POST Handler
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Parse body
    const body: SignupRequestBody = await req.json();
    const { email, password } = body;

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
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id.toString() }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Prepare user data to return (omit password)
    const userData = {
      _id: newUser._id.toString(),
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      preferences: newUser.preferences || {},
    };

    return NextResponse.json<SignupResponseBody>(
      { token, user: userData },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

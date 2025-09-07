// File: /app/api/auth/login/route.ts
// Purpose: Handle user login. Verifies credentials, returns JWT and user info if valid.

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User, { UserDocument } from "@/models/User";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";

// Type for the expected request body
interface LoginRequestBody {
  email: string;
  password: string;
}

// Type for the response user object
interface AuthenticatedUser {
  id: string;
  email: string;
  preferences?: Record<string, any>;
  avatarUrl?: string;
}

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    // Parse and validate incoming JSON
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Find the user by email
    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT using user ID
    const token = generateToken(user._id.toString());

    // Return token and user info (excluding sensitive data)
    const responseUser: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      preferences: user.preferences,
      avatarUrl: user.avatarUrl,
    };

    return NextResponse.json({ token, user: responseUser });
  } catch (error) {
    console.error("[Login Error]:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// File: /app/api/auth/signup/route.ts
// Purpose: Handle user registration. Creates a new user, hashes password, and returns a JWT.

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User, { UserDocument } from "@/models/User";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

// Type for incoming request body
interface SignupRequestBody {
  email: string;
  password: string;
}

// Type for the user object returned in the response
interface RegisteredUser {
  id: string;
  email: string;
  preferences?: Record<string, any>;
  avatarUrl?: string;
}

// POST /api/auth/signup
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body: SignupRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user already exists
    const existingUser: UserDocument | null = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password securely
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user in the database
    const newUser: UserDocument = await User.create({
      email,
      passwordHash,
      preferences: {},
      avatarUrl: "",
    });

    // Generate JWT for the new user
    const token = generateToken(newUser._id.toString());

    // Construct response user object
    const responseUser: RegisteredUser = {
      id: newUser._id.toString(),
      email: newUser.email,
      preferences: newUser.preferences,
      avatarUrl: newUser.avatarUrl,
    };

    return NextResponse.json({ token, user: responseUser });
  } catch (error) {
    console.error("[Signup Error]:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

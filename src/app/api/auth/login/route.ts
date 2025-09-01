// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined in .env.local");

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });

    // Return token and user info
    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

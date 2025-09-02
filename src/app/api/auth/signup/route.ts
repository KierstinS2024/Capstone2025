/* src/app/api/auth/signup/route.ts/**
 * POST /api/auth/signup
 * Registers a new user and returns a JWT
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";

const SALT_ROUNDS = 10;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return NextResponse.json({ message: "Email and password required" }, { status: 400 });

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: "User already exists" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({ email, passwordHash, preferences: {}, avatarUrl: "" });

    const token = generateToken(newUser._id.toString());

    return NextResponse.json({
      token,
      user: { id: newUser._id, email: newUser.email, preferences: newUser.preferences, avatarUrl: newUser.avatarUrl },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

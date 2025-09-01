// path: src/app/api/auth/signup/route.ts
/**
 * POST /api/auth/signup
 * Registers a new user
 * - Hashes password with bcrypt
 * - Stores user in MongoDB
 * - Returns JWT for authentication
 */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ email, passwordHash });

    // Create JWT
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token, user: { id: user._id, email: user.email } }, { status: 201 });
  } catch (err) {
    console.error("Error signing up user:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// path: src/app/api/auth/signup/route.ts
/**
 * POST /api/auth/signup
 * --------------------
 * Registers a new user with email and password.
 * Returns a JWT in an HttpOnly cookie and a client-safe user object.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { User as ClientUser } from "@/types/auth";

const COOKIE_NAME = "token";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password }: { email?: string; password?: string } =
      await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email }).lean<{ _id: string }>();
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user and lean to get plain object with typed _id
    const newUserDoc = await User.create({ email, password: hashedPassword });

    const safeUser: ClientUser = {
      _id: newUserDoc._id.toString(),
      email: newUserDoc.email,
      avatarUrl: newUserDoc.avatarUrl,
      preferences: newUserDoc.preferences || {},
    };

    const token = signToken({ userId: newUserDoc._id.toString() });

    const response = NextResponse.json({ user: safeUser }, { status: 201 });
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
    console.error("Signup route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

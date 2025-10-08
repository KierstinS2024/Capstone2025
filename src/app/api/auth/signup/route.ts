// ===========================================
// PATH: src/app/api/auth/signup/route.ts
// ===========================================
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "@/lib/cookieUtils";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  // Create new user (password will be hashed in model pre-save)
  const newUser = await User.create({ email, password });

  // Sign JWT
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Send cookie
  const res = NextResponse.json({ id: newUser._id, email: newUser.email });
  setTokenCookie(res, token);
  return res;
}

// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";
import { signJwt } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await connectDb();

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "User exists" }, { status: 400 });

    const newUser = await User.create({ email, password });
    const token = signJwt({ userId: newUser._id });

    const res = NextResponse.json({
      user: { email: newUser.email, id: newUser._id },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}

// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

type SignupRequestBody = { name: string; email: string; password: string };

export async function POST(req: Request) {
  try {
    const body: SignupRequestBody = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ email }).select("+passwordHash");
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      favorites: [],
    });

    await newUser.save();

    // Set a simple session cookie (just using user ID)
    const response = NextResponse.json({
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      favorites: [],
    });

    // HttpOnly cookie for session
    response.cookies.set({
      name: "session",
      value: newUser._id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}

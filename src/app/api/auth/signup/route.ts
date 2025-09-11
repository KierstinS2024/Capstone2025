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

    // Check for duplicate email
    const existingUser = await User.findOne({ email }).select("+passwordHash");
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      favorites: [],
      createdAt: new Date(), // optional
    });

    await newUser.save();

    // Create response with HttpOnly session cookie
    const response = NextResponse.json({
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        favorites: [],
      },
    });

    response.cookies.set({
      name: "session",
      value: newUser._id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // optional
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}

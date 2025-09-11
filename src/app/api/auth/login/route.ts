// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

type LoginRequestBody = { email: string; password: string };

export async function POST(req: Request) {
  try {
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const userDoc = await User.findOne({ email }).select("+passwordHash");
    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!userDoc.passwordHash) throw new Error("User password missing");

    const valid = await bcrypt.compare(password, userDoc.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Login successful: set session cookie
    const response = NextResponse.json({
      _id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      favorites: (userDoc.favorites as Types.ObjectId[]).map(
        (f: Types.ObjectId) => f.toString()
      ),
    });

    response.cookies.set({
      name: "session",
      value: userDoc._id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}

// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// POST handler to register a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,
    });

    // Generate a JWT for authentication
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error: JWT secret missing" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: "7d" });

    // Return the token and basic user info
    return NextResponse.json(
      { token, user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error registering user:", err);
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}

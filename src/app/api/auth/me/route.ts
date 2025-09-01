// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// GET handler to return the currently authenticated user's info
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error: JWT secret missing" },
        { status: 500 }
      );
    }

    // Decode the JWT to get the userId
    const decoded = jwt.verify(token, secret) as { userId: string };

    await connectToDatabase();

    // Find the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user info without password hash
    return NextResponse.json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Error fetching user info:", err);
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

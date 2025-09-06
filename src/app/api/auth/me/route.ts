/**
 * GET /api/auth/me
 * Returns the currently authenticated user's info
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        preferences: user.preferences,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("GET /auth/me error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

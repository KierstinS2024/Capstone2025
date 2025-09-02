// path: src/app/api/auth/me/route.ts
/**
 * GET /api/auth/me
 * Returns currently logged-in user info
 * JWT required in Authorization header
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token); // returns userId or throws error

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user: { id: user._id, email: user.email, preferences: user.preferences, avatarUrl: user.avatarUrl } });
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

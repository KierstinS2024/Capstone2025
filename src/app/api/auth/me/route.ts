// path: src/app/api/auth/me/route.ts
/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user
 * Requires Authorization: Bearer <token>
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Missing auth header" }, { status: 401 });

    const userId = verifyToken(authHeader);

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({
      id: user._id,
      email: user.email,
      preferences: user.preferences,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    console.error("Auth me error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

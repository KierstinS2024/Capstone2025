// path: src/app/api/auth/me/route.ts
/**
 * GET /api/auth/me
 * ----------------
 * Returns the currently authenticated user based on the JWT stored in an HttpOnly cookie.
 * Only safe fields are returned (no password hashes).
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { User as ClientUser } from "@/types/auth";

const COOKIE_NAME = "token";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Extract JWT from cookie
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT and extract userId
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user but exclude password by default (protected in schema)
    const userDoc = await User.findById(userId).lean<{
      _id: string;
      email: string;
      avatarUrl?: string;
      preferences?: Record<string, any>;
    }>();

    if (!userDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Construct safe user object
    const safeUser: ClientUser = {
      _id: userDoc._id,
      email: userDoc.email,
      avatarUrl: userDoc.avatarUrl,
      preferences: userDoc.preferences || {},
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (err) {
    console.error("Me route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

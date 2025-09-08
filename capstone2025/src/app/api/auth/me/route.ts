/**
 * src/app/api/auth/me/route.ts
 * GET /api/auth/me
 * Returns the currently authenticated user based on the JWT stored in an HttpOnly cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

// Cookie configuration (must match login/signup)
const COOKIE_NAME = "token";

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Retrieve the JWT from the cookie
    const token = req.cookies.get(COOKIE_NAME)?.value;

    // If no token is found, the user is unauthorized
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the JWT and extract userId
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json({ user });
  } catch (err) {
    // Log any unexpected errors
    console.error("Me route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

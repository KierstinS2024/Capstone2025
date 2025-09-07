// File: /app/api/auth/me/route.ts
// Purpose: Returns information about the currently authenticated user.
//          Requires a valid JWT in the Authorization header.

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User, { UserDocument } from "@/models/User";
import { verifyToken } from "@/lib/auth";

// Type for the response user object
interface AuthenticatedUser {
  id: string;
  email: string;
  preferences?: Record<string, any>;
  avatarUrl?: string;
}

// GET /api/auth/me
export async function GET(req: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Remove "Bearer " prefix to get the token
    const token = authHeader.replace("Bearer ", "").trim();

    // Verify JWT and extract user ID
    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Fetch user from DB, exclude password hash
    const user: UserDocument | null = await User.findById(userId).select(
      "-passwordHash"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Construct response object
    const responseUser: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      preferences: user.preferences,
      avatarUrl: user.avatarUrl,
    };

    return NextResponse.json({ user: responseUser });
  } catch (error) {
    console.error("[GET /auth/me Error]:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

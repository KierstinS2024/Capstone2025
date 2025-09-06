// path: src/app/api/favorites/route.ts
/**
 * Favorites API endpoints
 * ----------------------
 * POST   /favorites       -> add a recipe to favorites
 * GET    /favorites       -> list all favorites for the logged-in user
 * DELETE /favorites/:id   -> remove a favorite by recipe ID
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Favorite from "@/models/Favorite";
import { verifyToken } from "@/lib/auth";

// Add a recipe to favorites
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // --- AUTH ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { recipeId } = body;
    if (!recipeId)
      return NextResponse.json(
        { message: "recipeId required" },
        { status: 400 }
      );

    // Prevent duplicates
    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing)
      return NextResponse.json(
        { message: "Already in favorites" },
        { status: 409 }
      );

    const favorite = await Favorite.create({ userId, recipeId });
    return NextResponse.json({ data: favorite });
  } catch (err) {
    console.error("Adding favorite error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// Get all favorites for the logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: favorites });
  } catch (err) {
    console.error("Fetching favorites error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

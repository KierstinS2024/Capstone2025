// path: src/app/api/recipes/favorites/route.ts
/**
 * Favorites endpoints for recipes
 * - GET: list all saved/favorited recipes for the authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import Favorite from "@/models/Favorite"; // Separate collection to track user favorites
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
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

    // --- FETCH FAVORITES ---
    const favorites = await Favorite.find({ userId }).lean();

    // Map to recipe objects
    const recipeIds = favorites.map((f) => f.recipeId);
    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();

    // Merge internal recipes with external flag if needed
    const merged = recipes.map((r) => ({ ...r, isExternal: false }));

    return NextResponse.json({ data: merged });
  } catch (err) {
    console.error("Fetching favorites error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// path: src/app/api/recipes/favorites/route.ts
/**
 * Favorites API (List)
 * - GET: list all recipes favorited by the authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import Favorite from "@/models/Favorite";
import { requireAuth } from "@/lib/authHelpers";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    // Fetch favorites for this user
    const favorites = await Favorite.find({ userId }).lean();
    const recipeIds = favorites.map((f) => f.recipeId);

    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();
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

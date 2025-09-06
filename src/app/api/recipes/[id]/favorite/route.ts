// path: src/app/api/recipes/[id]/favorite/route.ts
/**
 * Recipe Favorite API
 * - POST: add recipe to favorites
 * - DELETE: remove recipe from favorites
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Favorite from "@/models/Favorite";
import { requireAuth } from "@/lib/authHelpers";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id: recipeId } = params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing)
      return NextResponse.json(
        { message: "Already in favorites" },
        { status: 400 }
      );

    const favorite = await Favorite.create({ userId, recipeId });
    return NextResponse.json({ data: favorite, message: "Added to favorites" });
  } catch (err) {
    console.error("Adding favorite error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id: recipeId } = params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const deleted = await Favorite.findOneAndDelete({ userId, recipeId });
    if (!deleted)
      return NextResponse.json(
        { message: "Recipe not in favorites" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("Removing favorite error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}


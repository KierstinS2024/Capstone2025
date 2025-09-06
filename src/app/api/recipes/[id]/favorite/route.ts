// path: src/app/api/recipes/[id]/favorite/route.ts
/**
 * Add or remove a recipe from user's favorites
 * - POST: add to favorites
 * - DELETE: remove from favorites
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import Favorite from "@/models/Favorite";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );

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

    // Check if already favorited
    const existing = await Favorite.findOne({ userId, recipeId: id });
    if (existing)
      return NextResponse.json(
        { message: "Already in favorites" },
        { status: 400 }
      );

    const favorite = await Favorite.create({ userId, recipeId: id });
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
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { message: "Invalid recipe ID" },
        { status: 400 }
      );

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

    const deleted = await Favorite.findOneAndDelete({ userId, recipeId: id });
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

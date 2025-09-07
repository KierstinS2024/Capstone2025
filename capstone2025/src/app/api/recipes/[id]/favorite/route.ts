// path: src/app/api/recipes/[id]/favorite/route.ts
/**
 * Recipe Favorite API
 * - POST: add recipe to favorites (JWT-protected)
 * - DELETE: remove recipe from favorites (JWT-protected)
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Favorite from "@/models/Favorite";
import { requireAuth } from "@/lib/authHelpers";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// POST /api/recipes/:id/favorite - add to favorites
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id: recipeId } = params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        message: "Recipe already in favorites",
      });
    }

    const favorite = await Favorite.create({ userId, recipeId });

    return NextResponse.json<ApiResponse<typeof favorite>>({
      success: true,
      data: favorite,
      message: "Added to favorites",
    });
  } catch (err) {
    console.error("Adding favorite error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/:id/favorite - remove from favorites
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id: recipeId } = params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const deleted = await Favorite.findOneAndDelete({ userId, recipeId });
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        message: "Recipe not in favorites",
      });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Removed from favorites",
    });
  } catch (err) {
    console.error("Removing favorite error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

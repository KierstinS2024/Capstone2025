// path: src/app/api/recipes/[id]/route.ts
/**
 * Recipe Individual API
 * - GET: fetch a single recipe
 * - PUT: update a recipe (JWT-protected, owner-only)
 * - DELETE: delete a recipe (JWT-protected, owner-only)
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";

export interface RecipeBody {
  title?: string;
  description?: string;
  ingredients?: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
  steps?: string[];
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// GET /api/recipes/:id - fetch single recipe
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findById(id).lean();
    if (!recipe) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof recipe>>({
      success: true,
      data: recipe,
    });
  } catch (err) {
    console.error("GET /api/recipes/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/:id - update recipe (owner-only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );
    }

    // Only owner can update
    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Forbidden: You do not own this recipe" },
        { status: 403 }
      );
    }

    const updates: RecipeBody = await req.json();
    Object.assign(recipe, updates);
    await recipe.save();

    return NextResponse.json<ApiResponse<typeof recipe>>({
      success: true,
      data: recipe,
      message: "Recipe updated successfully",
    });
  } catch (err) {
    console.error("PUT /api/recipes/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/:id - delete recipe (owner-only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );
    }

    // Only owner can delete
    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Forbidden: You do not own this recipe" },
        { status: 403 }
      );
    }

    await recipe.deleteOne();

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/recipes/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

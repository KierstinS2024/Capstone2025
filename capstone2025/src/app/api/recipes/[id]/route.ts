// Path: src/app/api/recipes/[id]/route.ts
"use server";

/**
 * Single Recipe API
 * -----------------
 * GET    → Fetch a single recipe by ID
 * PUT    → Update a user-submitted recipe (JWT required)
 * DELETE → Delete a user-submitted recipe (JWT required)
 * Features:
 * - Lean query for GET
 * - Zod validation for PUT
 * - Cookie-based JWT auth
 * - Spoonacular recipes are read-only
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import mongoose from "mongoose";

// Zod schema for updating a recipe
const updateRecipeSchema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.array(z.string()).optional(),
  cuisine: z.string().optional(),
  servings: z.number().positive("Servings must be positive").optional(),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string().min(1, "Ingredient ID is required"),
        quantity: z.number().positive("Quantity must be positive"),
        unit: z.string().optional(),
      })
    )
    .min(1, "At least one ingredient is required"),
});

/**
 * GET /api/recipes/[id]
 * - Returns a single recipe
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );

    const recipe = await Recipe.findById(id).lean();
    if (!recipe)
      return NextResponse.json(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: recipe });
  } catch (err) {
    console.error("GET /api/recipes/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to fetch recipe",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipes/[id]
 * - Updates a user-submitted recipe
 * - Spoonacular recipes are read-only
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );

    const recipe = await Recipe.findById(id);
    if (!recipe)
      return NextResponse.json(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );

    if (!recipe.userSubmitted)
      return NextResponse.json(
        { success: false, message: "Cannot edit read-only recipe" },
        { status: 403 }
      );

    if (recipe.createdByUserId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();
    const parsed = updateRecipeSchema.parse(body);

    Object.assign(recipe, parsed);
    await recipe.save();

    return NextResponse.json({ success: true, data: recipe });
  } catch (err) {
    console.error("PUT /api/recipes/[id] error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to update recipe",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/[id]
 * - Deletes a user-submitted recipe
 * - Spoonacular recipes are read-only
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid recipe ID" },
        { status: 400 }
      );

    const recipe = await Recipe.findById(id);
    if (!recipe)
      return NextResponse.json(
        { success: false, message: "Recipe not found" },
        { status: 404 }
      );

    if (!recipe.userSubmitted)
      return NextResponse.json(
        { success: false, message: "Cannot delete read-only recipe" },
        { status: 403 }
      );

    if (recipe.createdByUserId !== userId)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    await recipe.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/recipes/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to delete recipe",
      },
      { status: 500 }
    );
  }
}

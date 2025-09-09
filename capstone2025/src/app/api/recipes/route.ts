// Path: src/app/api/recipes/route.ts
"use server";

/**
 * Recipes Collection API
 * ----------------------
 * GET  → List all recipes with optional search/filter (JWT required)
 * POST → Create a new user-submitted recipe (JWT required)
 * Features:
 * - Lean queries for performance
 * - Zod validation for POST
 * - Supports filtering by title & cuisine
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";

// Zod schema for creating a recipe
const createRecipeSchema = z.object({
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
 * GET /api/recipes
 * - Returns all recipes
 * - Supports optional query parameters: search (title), cuisine
 * - Sorted by title
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    requireAuth(req); // JWT check via cookie

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const cuisine = searchParams.get("cuisine");

    const query: Record<string, any> = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (cuisine) query.cuisine = cuisine;

    const recipes = await Recipe.find(query).sort({ title: 1 }).lean();
    return NextResponse.json({ success: true, data: recipes });
  } catch (err) {
    console.error("GET /api/recipes error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to fetch recipes",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes
 * - Creates a new user-submitted recipe (JWT required)
 * - Validates input via Zod
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req); // cookie-based JWT

    const body = await req.json();
    const parsed: z.infer<typeof createRecipeSchema> =
      createRecipeSchema.parse(body);

    const newRecipe = await Recipe.create({
      ...parsed,
      userSubmitted: true,
      createdByUserId: userId,
      source: "user", // explicitly mark as user-submitted
    });

    return NextResponse.json(
      { success: true, data: newRecipe },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/recipes error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to create recipe",
      },
      { status: 500 }
    );
  }
}

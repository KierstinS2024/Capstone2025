// Path: src/app/api/ingredients/route.ts
"use server";

/**
 * Ingredients Collection API
 * --------------------------
 * GET  → List all ingredients (JWT required)
 * POST → Create a new ingredient (JWT required)
 * Features:
 * - Lean queries
 * - Zod validation for POST
 * - Sorted alphabetically by name
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";

// Zod schema for POST
const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  unit: z.string().min(1, "Unit is required"),
  defaultQuantity: z.number().positive("Quantity must be positive"),
  nutritionInfo: z.record(z.any()).optional(),
});

/**
 * GET /api/ingredients
 * - Returns all ingredients for authenticated user
 * - Sorted alphabetically by name
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req); // JWT via cookie

    const ingredients = await Ingredient.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: ingredients });
  } catch (err) {
    console.error("GET /api/ingredients error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to fetch ingredients",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ingredients
 * - Creates a new ingredient
 * - Validates input via Zod
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const body = await req.json();
    const parsed = createIngredientSchema.parse(body);

    const newIngredient = await Ingredient.create({
      ...parsed,
      createdByUserId: userId,
    });

    return NextResponse.json(
      { success: true, data: newIngredient },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/ingredients error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to create ingredient",
      },
      { status: 500 }
    );
  }
}

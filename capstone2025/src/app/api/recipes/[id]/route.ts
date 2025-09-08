// Path: src/app/api/recipes/[id]/route.ts

/**
 * Recipes API (Single Recipe)
 * - GET: fetch a recipe by ID
 * - PUT: update recipe (user recipes only)
 * - DELETE: remove recipe (user recipes only)
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";

interface Params {
  params: { id: string };
}

/**
 * GET /api/recipes/:id
 */
export async function GET(_: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    const recipe = await Recipe.findById(params.id).lean();
    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("GET /api/recipes/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error fetching recipe" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipes/:id
 * - Only user recipes can be updated
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    // ✅ Block editing of Spoonacular recipes
    if (recipe.source === "spoonacular") {
      return NextResponse.json(
        { message: "Spoonacular recipes are read-only" },
        { status: 403 }
      );
    }

    // ✅ Allow editing only if user owns the recipe
    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json(
        { message: "Not authorized to update this recipe" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, instructions, cuisine, ingredients } = body;

    recipe.name = name ?? recipe.name;
    recipe.description = description ?? recipe.description;
    recipe.instructions = instructions ?? recipe.instructions;
    recipe.cuisine = cuisine ?? recipe.cuisine;
    recipe.ingredients = ingredients ?? recipe.ingredients;

    await recipe.save();

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("PUT /api/recipes/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error updating recipe" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/:id
 * - Only user recipes can be deleted
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    // ✅ Block deletion of Spoonacular recipes
    if (recipe.source === "spoonacular") {
      return NextResponse.json(
        { message: "Spoonacular recipes cannot be deleted" },
        { status: 403 }
      );
    }

    // ✅ Allow deletion only if user owns the recipe
    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json(
        { message: "Not authorized to delete this recipe" },
        { status: 403 }
      );
    }

    await Recipe.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/recipes/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error deleting recipe" },
      { status: 500 }
    );
  }
}

// path: src/app/api/recipes/[id]/route.ts
/**
 * Recipe API (single recipe)
 * Handles GET, PUT, DELETE for a single recipe by ID.
 * GET: Retrieve recipe details
 * PUT: Update a recipe (requires authentication & ownership)
 * DELETE: Delete a recipe (requires authentication & ownership)
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const recipeId = params.id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ message: "Invalid recipe ID" }, { status: 400 });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const recipeId = params.id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ message: "Invalid recipe ID" }, { status: 400 });
    }

    const { name, description, cuisine, instructions, ingredients } = await req.json();

    await connectToDatabase();

    // Ensure the recipe exists and is owned by user
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    if (!recipe.createdByUserId?.equals(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Update fields
    recipe.name = name || recipe.name;
    recipe.description = description || recipe.description;
    recipe.cuisine = cuisine || recipe.cuisine;
    recipe.instructions = instructions || recipe.instructions;
    if (ingredients) {
      recipe.ingredients = ingredients.map((item: any) => ({
        ingredientId: new mongoose.Types.ObjectId(item.ingredientId),
        quantity: item.quantity,
        unit: item.unit,
      }));
    }

    await recipe.save();

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("Error updating recipe:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const recipeId = params.id;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ message: "Invalid recipe ID" }, { status: 400 });
    }

    await connectToDatabase();

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    if (!recipe.createdByUserId?.equals(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await recipe.deleteOne();

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

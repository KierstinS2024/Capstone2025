// path: src/app/api/recipes/route.ts
/**
 * Recipe API
 * Handles GET (list/search recipes) and POST (create recipe) requests.
 * 
 * GET: Fetch all recipes, optionally filtered by query parameters (e.g., cuisine, diet)
 * POST: Create a new recipe (requires authentication)
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/recipes
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const cuisine = url.searchParams.get("cuisine"); // optional filter
    const name = url.searchParams.get("name");       // optional filter

    const filter: any = {};
    if (cuisine) filter.cuisine = cuisine;
    if (name) filter.name = { $regex: name, $options: "i" };

    // Fetch recipes from DB
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ recipes });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// POST /api/recipes
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // throws if invalid

    const { name, description, cuisine, instructions, ingredients } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ message: "Name and description are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Create recipe in DB
    const newRecipe = await Recipe.create({
      name,
      description,
      cuisine: cuisine || "",
      instructions: instructions || [],
      userSubmitted: true,
      createdByUserId: new mongoose.Types.ObjectId(userId),
      ingredients: ingredients?.map((item: any) => ({
        ingredientId: new mongoose.Types.ObjectId(item.ingredientId),
        quantity: item.quantity,
        unit: item.unit,
      })) || [],
    });

    return NextResponse.json({ recipe: newRecipe }, { status: 201 });
  } catch (err) {
    console.error("Error creating recipe:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

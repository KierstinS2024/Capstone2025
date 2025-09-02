// path: src/app/api/recipes/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { verifyToken } from "@/lib/auth";

/**
 * GET /api/recipes
 * List all recipes or search/filter by query parameters
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const cuisine = searchParams.get("cuisine");

    const query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (cuisine) query.cuisine = cuisine;

    const recipes = await Recipe.find(query).lean();

    return NextResponse.json({ recipes });
  } catch (err) {
    console.error("GET /api/recipes error:", err);
    return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
  }
}

/**
 * POST /api/recipes
 * Create a new recipe (JWT required)
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify JWT from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { name, description, instructions, cuisine, ingredients } = body;

    if (!name || !description || !ingredients?.length) {
      return NextResponse.json({ message: "Name, description, and ingredients required" }, { status: 400 });
    }

    const newRecipe = await Recipe.create({
      name,
      description,
      instructions: instructions || [],
      cuisine: cuisine || "",
      userSubmitted: true,
      createdByUserId: userId,
      ingredients,
    });

    return NextResponse.json({ recipe: newRecipe }, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes error:", err);
    return NextResponse.json({ message: "Error creating recipe" }, { status: 500 });
  }
}

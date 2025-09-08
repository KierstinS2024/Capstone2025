// Path: src/app/api/recipes/route.ts

/**
 * Recipes API (Collection)
 * - GET: list all recipes or search/filter
 * - POST: create new recipe (JWT required)
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";

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
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Error fetching recipes",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const body = await req.json();
    const { name, description, instructions, cuisine, ingredients } = body;

    if (!name || !description || !ingredients?.length) {
      return NextResponse.json(
        { message: "Name, description, and ingredients required" },
        { status: 400 }
      );
    }

    const newRecipe = await Recipe.create({
      name,
      description,
      instructions: instructions || [],
      cuisine: cuisine || "",
      userSubmitted: true,
      createdByUserId: userId,
      ingredients,
      source: "user", // ✅ explicitly mark as user recipe
    });

    return NextResponse.json({ recipe: newRecipe }, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Error creating recipe" },
      { status: 500 }
    );
  }
}

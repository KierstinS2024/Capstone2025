// src/app/api/recipes/route.ts
// Recipes API: GET all recipes, POST create new recipe
// Connects to MongoDB via db.ts and uses Recipe model

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RecipeModel from "@/models/Recipe";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Optional: query param ?userId=123 to filter user-specific recipes
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const recipes = await RecipeModel.find(filter);

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const data = await req.json();

    // Basic type validation
    if (!data.title || !data.ingredients || !Array.isArray(data.ingredients)) {
      return NextResponse.json(
        { message: "Invalid recipe data" },
        { status: 400 }
      );
    }

    const newRecipe = await RecipeModel.create({
      ...data,
      source: data.source || "local",
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("POST /api/recipes error:", error);
    return NextResponse.json(
      { message: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

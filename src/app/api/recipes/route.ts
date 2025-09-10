"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

/**
 * GET /api/recipes
 * Returns all recipes, optionally filtered by userId
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const filter = userId ? { userId } : {};
    const recipes = await Recipe.find(filter);
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes
 * Create a new recipe
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    if (!data.title || !data.ingredients || !Array.isArray(data.ingredients)) {
      return NextResponse.json(
        { message: "Invalid recipe data" },
        { status: 400 }
      );
    }

    const newRecipe = await Recipe.create({
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

// path: src/app/api/recipes/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

const SPOONACULAR_API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

/**
 * GET /api/recipes
 * Returns combined recipes:
 * - User-created recipes from MongoDB
 * - Random Spoonacular recipes
 * Optional query: userId to filter local recipes
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const filter = userId ? { userId } : {};

    // Fetch user-created recipes
    const localRecipes = await Recipe.find(filter);

    // Fetch Spoonacular recipes
    let spoonacularRecipes: any[] = [];
    if (SPOONACULAR_API_KEY) {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/random?number=10&apiKey=${SPOONACULAR_API_KEY}`
        );
        if (res.ok) {
          const data = await res.json();
          spoonacularRecipes = data.recipes.map((r: any) => ({
            id: r.id.toString(),
            title: r.title,
            summary: r.summary.replace(/<[^>]*>/g, ""), // strip HTML
            readyInMinutes: r.readyInMinutes,
            source: "spoonacular",
          }));
        }
      } catch (err) {
        console.error("Spoonacular fetch failed:", err);
      }
    }

    // Normalize local recipes
    const normalizedLocal = localRecipes.map((r: any) => ({
      id: r._id.toString(),
      title: r.title,
      summary: r.summary || "",
      readyInMinutes: r.readyInMinutes || 0,
      source: r.source || "local",
    }));

    // Merge both sources
    const recipes = [...normalizedLocal, ...spoonacularRecipes];

    return NextResponse.json({ recipes }, { status: 200 });
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
 * Create a new user recipe in MongoDB
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

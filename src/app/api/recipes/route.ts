// ===========================================
// PATH: src/app/api/recipes/route.ts
// Recipe API — handles CRUD operations for user recipes
// Temporary recipes and linkedMealPlanIds removed
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

/**
 * GET all recipes for a specific user
 * Pass `author` as query param (user email) to get only their recipes
 */
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const author = searchParams.get("author"); // user's email

  const filter = author ? { author } : {}; // filter by user if provided
  const recipes = await Recipe.find(filter).sort({ createdAt: -1 }); // latest first

  return NextResponse.json(recipes);
}

/**
 * POST create a new recipe
 * Requires `author` in body to associate recipe with a user
 * Removed: temporary flag and linkedMealPlanIds
 */
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    if (!body.author) {
      return NextResponse.json({ error: "Missing author" }, { status: 400 });
    }

    // Build recipe object for creation
    const recipeData = {
      title: body.title,
      ingredients: body.ingredients || [],
      instructions: body.instructions || "",
      image: body.image || null,
      source: body.source || "user",
      author: body.author, // user email
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save recipe in database
    const recipe = await Recipe.create(recipeData);

    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("POST /api/recipes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT update an existing recipe
 * Body must include `id` and fields to update
 */
export async function PUT(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
    }

    updates.updatedAt = new Date(); // update timestamp

    const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("PUT /api/recipes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE a recipe by ID
 */
export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/recipes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

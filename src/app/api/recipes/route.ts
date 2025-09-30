// ===========================================
// PATH: src/app/api/recipes/route.ts
// Collection-level API routes for Recipes
// - GET all recipes for a user
// - POST a new recipe
// All actions are scoped to the authenticated user via userEmail
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { getAllRecipes, createRecipe } from "@/lib/db";

// -----------------------------
// GET → Fetch all recipes for a user
// Usage: GET /api/recipes?userEmail=foo@bar.com
// -----------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  try {
    const recipes = await getAllRecipes(userEmail);
    return NextResponse.json(recipes);
  } catch (err) {
    console.error("GET /api/recipes failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// -----------------------------
// POST → Create a new recipe
// Usage: POST /api/recipes?userEmail=foo@bar.com
// Body: { title, ingredients, instructions, ... }
// -----------------------------
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Force ownership: recipe always tied to the current user
    const newRecipe = await createRecipe({
      ...body,
      author: userEmail,
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes failed:", err);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

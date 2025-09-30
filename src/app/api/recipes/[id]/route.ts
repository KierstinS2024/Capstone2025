// ===========================================
// PATH: src/app/api/recipes/[id]/route.ts
// Entity-level API routes for Recipes
// - GET a single recipe
// - PATCH (update) a recipe
// - DELETE a recipe
// Scoped to userEmail to prevent access to other users' data
// Fully compatible with Next.js App Router dynamic params
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { getRecipeById, updateRecipeById, deleteRecipeById } from "@/lib/db";

// -----------------------------
// GET → Fetch a single recipe by ID
// Example: GET /api/recipes/:id?userEmail=foo@bar.com
// -----------------------------
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  // Await params in App Router
  const { params } = context;
  const id = params.id;

  // Extract userEmail from query string
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  // Fetch recipe from DB
  const recipe = await getRecipeById(id);

  // Validate recipe ownership
  if (!recipe || recipe.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

// -----------------------------
// PATCH → Update a recipe by ID
// Example: PATCH /api/recipes/:id?userEmail=foo@bar.com
// Body: { title?, ingredients?, instructions?, ... }
// -----------------------------
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = params.id;

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  // Fetch and validate recipe ownership
  const recipe = await getRecipeById(id);
  if (!recipe || recipe.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Parse updates from request body
  const updates = await req.json();

  // Update recipe in DB
  const updatedRecipe = await updateRecipeById(id, updates);

  return NextResponse.json(updatedRecipe);
}

// -----------------------------
// DELETE → Delete a recipe by ID
// Example: DELETE /api/recipes/:id?userEmail=foo@bar.com
// -----------------------------
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const id = params.id;

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  // Fetch recipe and validate ownership
  const recipe = await getRecipeById(id);
  if (!recipe || recipe.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete recipe
  await deleteRecipeById(id);

  return NextResponse.json({ success: true });
}

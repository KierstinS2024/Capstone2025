// ===========================================
// PATH: src/app/api/recipes/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

// -----------------------------
// GET all recipes
// -----------------------------
export async function GET() {
  await connectDB();
  const recipes = await Recipe.find();
  return NextResponse.json(recipes);
}

// -----------------------------
// POST create new recipe
// - Supports temporary and linkedMealPlanIds
// -----------------------------
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();

    // Ensure linkedMealPlanIds is always an array
    if (!body.linkedMealPlanIds) body.linkedMealPlanIds = [];

    const recipe = await Recipe.create(body);
    return NextResponse.json(recipe);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// PUT update existing recipe
// -----------------------------
export async function PUT(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id)
      return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });

    const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true });
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    return NextResponse.json(recipe);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// DELETE recipe
// - Used for removing temporary recipes
// -----------------------------
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Missing recipe ID" }, { status: 400 });

    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

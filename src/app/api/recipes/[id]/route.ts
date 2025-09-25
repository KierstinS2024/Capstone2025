// ===========================================
// PATH: src/app/api/recipes/[id]/route.ts
// Dynamic API route for GET, PUT, DELETE a single user recipe
// Temporary recipes removed
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

/**
 * GET /api/recipes/[id]
 * Fetch a single recipe by ID
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  await connectDB();

  try {
    const { id } = await context.params; // wait for params
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("GET /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/recipes/[id]
 * Update a recipe by ID
 * Body should include only the fields to update
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const { id } = await context.params; // wait for params
    const updates = await req.json();

    updates.updatedAt = new Date(); // always update timestamp

    const recipe = await Recipe.findByIdAndUpdate(id, updates, { new: true });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("PUT /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/recipes/[id]
 * Permanently delete a recipe by ID
 */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const { id } = await context.params; // wait for params
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

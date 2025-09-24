// ===========================================
// PATH: src/app/api/recipes/[id]/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

interface Params {
  params: { id: string };
}

/**
 * GET recipe by ID
 */
export async function GET(_: Request, { params }: Params) {
  await connectDB();
  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("GET /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT update recipe by ID
 */
export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  try {
    const updates = await req.json();
    updates.updatedAt = new Date();

    const recipe = await Recipe.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    return NextResponse.json(recipe);
  } catch (err: any) {
    console.error("PUT /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE recipe by ID
 */
export async function DELETE(_: Request, { params }: Params) {
  await connectDB();
  try {
    const recipe = await Recipe.findByIdAndDelete(params.id);
    if (!recipe)
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/recipes/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

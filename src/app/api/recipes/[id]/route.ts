// path: src/app/api/recipes/[id]/route.ts
/**
 * Recipe API (Individual)
 * - GET: fetch a single recipe
 * - PUT: update recipe (JWT required, owner only)
 * - DELETE: delete recipe (JWT required, owner only)
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { requireAuth } from "@/lib/authHelpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const recipe = await Recipe.findById(params.id).lean();
    if (!recipe)
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("GET /api/recipes/:id error:", err);
    return NextResponse.json(
      { message: "Error fetching recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const recipe = await Recipe.findById(params.id);
    if (!recipe)
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );

    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updates = await req.json();
    Object.assign(recipe, updates);
    await recipe.save();

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("PUT /api/recipes/:id error:", err);
    return NextResponse.json(
      { message: "Error updating recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const recipe = await Recipe.findById(params.id);
    if (!recipe)
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );

    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await recipe.deleteOne();
    return NextResponse.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("DELETE /api/recipes/:id error:", err);
    return NextResponse.json({ message: "Error deleting recipe" }, { status: 500 });
  }
}

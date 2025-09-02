// path: src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Recipe from "@/models/Recipe";
import { verifyToken } from "@/lib/auth";

/**
 * GET /api/recipes/:id
 * Fetch a single recipe by ID
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const recipe = await Recipe.findById(params.id).lean();
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("GET /api/recipes/:id error:", err);
    return NextResponse.json({ message: "Error fetching recipe" }, { status: 500 });
  }
}

/**
 * PUT /api/recipes/:id
 * Update a recipe (JWT required, owner only)
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();

    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    // Only the creator can update
    if (!recipe.createdByUserId || recipe.createdByUserId.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    Object.assign(recipe, body); // Merge updates
    await recipe.save();

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("PUT /api/recipes/:id error:", err);
    return NextResponse.json({ message: "Error updating recipe" }, { status: 500 });
  }
}

/**
 * DELETE /api/recipes/:id
 * Delete a recipe (JWT required, owner only)
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    // Only the creator can delete
    if (!recipe.createdByUserId || recipe.createdByUserId.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await recipe.deleteOne();
    return NextResponse.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("DELETE /api/recipes/:id error:", err);
    return NextResponse.json({ message: "Error deleting recipe" }, { status: 500 });
  }
}

"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

/**
 * GET /api/recipes/:id
 * Returns a single recipe by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const recipe = await Recipe.findById(params.id);
    if (!recipe)
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("GET /api/recipes/:id error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/:id
 * Delete a recipe by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    await Recipe.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/recipes/:id error:", error);
    return NextResponse.json(
      { message: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}

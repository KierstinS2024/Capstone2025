// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";

// Helper to get userId from the Authorization header
function getUserIdFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.split(" ")[1]);
}

// GET: Retrieve a single recipe by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    return NextResponse.json({ recipe }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching recipe" }, { status: 500 });
  }
}

// PUT: Update a recipe (requires authentication)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json({ message: "Not authorized to edit this recipe" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, instructions, nutritionInfo, cuisine } = body;

    recipe.name = name || recipe.name;
    recipe.description = description || recipe.description;
    recipe.instructions = instructions || recipe.instructions;
    recipe.nutritionInfo = nutritionInfo || recipe.nutritionInfo;
    recipe.cuisine = cuisine || recipe.cuisine;

    await recipe.save();
    return NextResponse.json({ recipe }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating recipe" }, { status: 500 });
  }
}

// DELETE: Remove a recipe (requires authentication)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) return NextResponse.json({ message: "Recipe not found" }, { status: 404 });

    if (recipe.createdByUserId?.toString() !== userId) {
      return NextResponse.json({ message: "Not authorized to delete this recipe" }, { status: 403 });
    }

    await recipe.deleteOne();
    return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting recipe" }, { status: 500 });
  }
}

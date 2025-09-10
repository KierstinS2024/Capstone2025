// src/app/api/recipes/[id]/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

// --------------------
// GET /api/recipes/[id]
// --------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("GET /recipes/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// --------------------
// PUT /api/recipes/[id]
// --------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const data = await req.json();

    const recipe = await Recipe.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("PUT /recipes/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// --------------------
// DELETE /api/recipes/[id]
// --------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const recipe = await Recipe.findByIdAndDelete(params.id);

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /recipes/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}

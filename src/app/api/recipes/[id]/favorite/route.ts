// src/app/api/recipes/[id]/favorite/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

export async function POST(
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

    recipe.favorite = !recipe.favorite;
    await recipe.save();

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("POST /recipes/[id]/favorite error:", error);
    return NextResponse.json(
      { message: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}

// ===========================================
// src/app/api/recipes/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

// GET all recipes
export async function GET() {
  await connectDB();
  const recipes = await Recipe.find();
  return NextResponse.json(recipes);
}

// POST create new recipe
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const recipe = await Recipe.create(body);
  return NextResponse.json(recipe);
}

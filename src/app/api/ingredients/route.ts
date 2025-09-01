// src/app/api/ingredients/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { verifyToken } from "@/lib/auth";

// GET: list all ingredients
export async function GET() {
  await connectToDatabase();

  const ingredients = await Ingredient.find({});
  return NextResponse.json({ ingredients }, { status: 200 });
}

// POST: create a new ingredient (auth required)
export async function POST(req: NextRequest) {
  await connectToDatabase();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const userId = verifyToken(token);
  if (!userId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { name, unit, defaultQuantity, nutritionInfo } = body;

  if (!name) {
    return NextResponse.json({ message: "Name is required for an ingredient" }, { status: 400 });
  }

  const newIngredient = await Ingredient.create({
    name,
    unit,
    defaultQuantity,
    nutritionInfo,
  });

  return NextResponse.json({ ingredient: newIngredient }, { status: 201 });
}

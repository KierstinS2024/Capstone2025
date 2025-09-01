// src/app/api/ingredients/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { verifyToken } from "@/lib/auth";

// Handles GET, PUT, DELETE for a single ingredient by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const ingredient = await Ingredient.findById(params.id);
  if (!ingredient) {
    return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });
  }

  return NextResponse.json({ ingredient }, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

  const updatedIngredient = await Ingredient.findByIdAndUpdate(
    params.id,
    { name, unit, defaultQuantity, nutritionInfo },
    { new: true }
  );

  if (!updatedIngredient) {
    return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });
  }

  return NextResponse.json({ ingredient: updatedIngredient }, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

  const deletedIngredient = await Ingredient.findByIdAndDelete(params.id);
  if (!deletedIngredient) {
    return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Ingredient deleted successfully" }, { status: 200 });
}

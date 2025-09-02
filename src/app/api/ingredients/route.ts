// path: src/app/api/ingredients/route.ts
/**
 * Ingredients collection endpoints
 * - GET: list all ingredients
 * - POST: create a new ingredient
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // --- AUTH ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // --- FETCH ALL INGREDIENTS ---
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return NextResponse.json({ data: ingredients });
  } catch (err) {
    console.error("Fetching ingredients error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { name, unit, defaultQuantity, nutritionInfo } = body;

    if (!name || !unit || !defaultQuantity) {
      return NextResponse.json({ message: "name, unit, and defaultQuantity are required" }, { status: 400 });
    }

    // --- CREATE NEW INGREDIENT ---
    const ingredient = await Ingredient.create({
      name,
      unit,
      defaultQuantity,
      nutritionInfo: nutritionInfo || {},
    });

    return NextResponse.json({ data: ingredient });
  } catch (err) {
    console.error("Creating ingredient error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

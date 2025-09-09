// path: src/app/api/food-intake/route.ts
/**
 * Food Intake collection endpoints
 * - POST: log a new food intake (recipe or ingredient)
 * - GET: list all food intake logs for the authenticated user
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import FoodIntake from "@/models/FoodIntake";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // --- AUTH ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // --- BODY VALIDATION ---
    const body = await req.json();
    const { recipeId, ingredientId, date, quantity, unit, nutritionSnapshot } = body;

    if (!date || !quantity || !unit || (!recipeId && !ingredientId)) {
      return NextResponse.json({ message: "date, quantity, unit, and either recipeId or ingredientId required" }, { status: 400 });
    }

    // --- CREATE FOOD INTAKE LOG ---
    const foodIntake = await FoodIntake.create({
      userId,
      recipeId,
      ingredientId,
      date,
      quantity,
      unit,
      nutritionSnapshot: nutritionSnapshot || {},
    });

    return NextResponse.json({ data: foodIntake });
  } catch (err) {
    console.error("Creating food intake error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // --- AUTH ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // --- FETCH USER FOOD INTAKE LOGS ---
    const foodIntakes = await FoodIntake.find({ userId }).sort({ date: -1 });
    return NextResponse.json({ data: foodIntakes });
  } catch (err) {
    console.error("Fetching food intake logs error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

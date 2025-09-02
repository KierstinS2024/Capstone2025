// path: src/app/api/meal-plans/entries/route.ts
/**
 * POST /api/meal-plans/entries
 * Add a new entry to a user's meal plan
 * Body should include:
 *   - mealPlanId: string
 *   - recipeId: string
 *   - dayOfWeek: string (e.g., "Monday")
 *   - mealType: string (e.g., "Breakfast")
 *   - servings: number
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = getTokenFromHeader(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { mealPlanId, recipeId, dayOfWeek, mealType, servings } = await req.json();

    if (!mealPlanId || !recipeId || !dayOfWeek || !mealType || !servings) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    // Add new entry
    const newEntry = { recipeId, dayOfWeek, mealType, servings };
    mealPlan.entries.push(newEntry);
    await mealPlan.save();

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (err) {
    console.error("POST /meal-plans/entries error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

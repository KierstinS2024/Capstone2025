// path: src/app/api/meal-plans/entries/[mealPlanId]/route.ts
/**
 * Meal Plan Entries API
 * Handles adding new entries to a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * POST /api/meal-plans/entries/[mealPlanId]
 * Add new entries to a meal plan
 */
export async function POST(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    await connectToDatabase();

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { mealPlanId } = params;
    const { entries } = await req.json(); // expects an array of entries

    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ message: "Entries array required" }, { status: 400 });
    }

    // Validate and push new entries
    entries.forEach((entry: any) => {
      const { recipeId, dayOfWeek, mealType, servings } = entry;
      if (!recipeId || !dayOfWeek || !mealType) {
        throw new Error("Each entry must include recipeId, dayOfWeek, and mealType");
      }
      mealPlan.entries.push({
        recipeId,
        dayOfWeek,
        mealType,
        servings: servings || 1,
      });
    });

    await mealPlan.save();

    return NextResponse.json(mealPlan.entries);
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

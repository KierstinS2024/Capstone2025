// src/app/api/meal-plans/[id]/route.ts
/**
 * Meal Plan Entries API (Collection)
 * Handles adding new entries to a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req); // secure auth check

    const { id: mealPlanId } = params;
    const { recipeId, day, servings } = await req.json();

    if (!recipeId || !day || !servings) {
      return NextResponse.json(
        { message: "recipeId, day, and servings are required" },
        { status: 400 }
      );
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const newEntry = { recipeId, day, servings };
    mealPlan.entries.push(newEntry);

    await mealPlan.save();

    return NextResponse.json(
      { message: "Entry added", entry: newEntry },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /meal-plans/:id/entries error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

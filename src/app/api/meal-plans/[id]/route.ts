// path: src/app/api/meal-plans/[id]/route.ts
/**
 * Single Meal Plan API
 * Handles GET to retrieve a specific meal plan by ID
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mealPlanId = params.id;
    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    await connectToDatabase();

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) {
      return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });
    }

    return NextResponse.json({ mealPlan });
  } catch (err) {
    console.error("Error fetching meal plan:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

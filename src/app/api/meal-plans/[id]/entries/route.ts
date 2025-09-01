// path: src/app/api/meal-plans/[id]/entries/route.ts
/**    
 * Meal Plan Entry API (add recipe to a plan)
 * POST: Add a recipe to a meal plan (requires authentication)
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const mealPlanId = params.id;
    const { recipeId, dayOfWeek, mealType, servings } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(mealPlanId) || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    await connectToDatabase();

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });
    if (!mealPlan.userId.equals(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const newEntry = {
      _id: new mongoose.Types.ObjectId(),
      recipeId: new mongoose.Types.ObjectId(recipeId),
      dayOfWeek,
      mealType,
      servings: servings || 1,
    };

    mealPlan.entries.push(newEntry);
    await mealPlan.save();

    return NextResponse.json({ entry: newEntry }, { status: 201 });
  } catch (err) {
    console.error("Error adding entry to meal plan:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

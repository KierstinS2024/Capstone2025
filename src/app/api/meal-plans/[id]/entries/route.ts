// path: src/app/api/meal-plans/[id]/entries/route.ts
/**
 * Meal Plan Entries API (POST)
 * Adds a new entry to a specific meal plan
 *
 * - POST: Add a new entry (recipeId, dayOfWeek, mealType, servings)
 *
 * Fully JWT-protected; users can only add entries to their own meal plans.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const mealPlanId = params.id;

    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    const { recipeId, dayOfWeek, mealType, servings } = await req.json();

    if (!recipeId || !dayOfWeek || !mealType || !servings) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Find the meal plan belonging to the user
    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found or unauthorized" }, { status: 404 });

    // Add new entry
    const newEntry = {
      recipeId,
      dayOfWeek,
      mealType,
      servings,
    };

    mealPlan.entries.push(newEntry);
    await mealPlan.save();

    // Return the newly added entry
    const addedEntry = mealPlan.entries[mealPlan.entries.length - 1];

    return NextResponse.json({ message: "Entry added successfully", entry: addedEntry });
  } catch (err) {
    console.error("POST /meal-plans/[id]/entries error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

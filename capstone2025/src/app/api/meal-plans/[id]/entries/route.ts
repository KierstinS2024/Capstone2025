//src/app/api/meal-plans/[id]/entries/route.ts
/**
 * Meal Plan Entries API
 * Add a new entry to a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// --- Extract JWT from Authorization header ---
function getToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

// --- POST add a new entry ---
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    const { id: mealPlanId } = context.params;
    if (!mongoose.Types.ObjectId.isValid(mealPlanId))
      return NextResponse.json(
        { message: "Invalid meal plan ID" },
        { status: 400 }
      );

    const { recipeId, dayOfWeek, mealType, servings } = await req.json();
    if (!recipeId || !dayOfWeek || !mealType || !servings)
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const newEntry = { recipeId, dayOfWeek, mealType, servings };
    mealPlan.entries.push(newEntry);
    await mealPlan.save();

    const addedEntry = mealPlan.entries[mealPlan.entries.length - 1];
    return NextResponse.json(
      { message: "Entry added successfully", entry: addedEntry },
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

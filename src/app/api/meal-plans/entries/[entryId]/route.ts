// path: src/app/api/meal-plans/entries/[entryId]/route.ts
/**
 * Meal Plan Entry API
 * Handles CRUD for individual entries within a specific meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

/**
 * GET /api/meal-plans/entries/[entryId]
 * Fetch a single entry by ID (optional for frontend display)
 */
export async function GET(req: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    await connectToDatabase();
    const { entryId } = params;

    // Find the meal plan that contains this entry
    const mealPlan = await MealPlan.findOne({ "entries._id": entryId });
    if (!mealPlan) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    const entry = mealPlan.entries.id(entryId);
    return NextResponse.json({ entry });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/meal-plans/entries/[entryId]
 * Update an existing entry
 */
export async function PUT(req: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    await connectToDatabase();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const userId = token && (await verifyToken(token));
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { entryId } = params;
    const { recipeId, dayOfWeek, mealType, servings } = await req.json();

    const mealPlan = await MealPlan.findOne({ "entries._id": entryId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    const entry = mealPlan.entries.id(entryId);
    if (recipeId) entry.recipeId = recipeId;
    if (dayOfWeek) entry.dayOfWeek = dayOfWeek;
    if (mealType) entry.mealType = mealType;
    if (servings) entry.servings = servings;

    await mealPlan.save();
    return NextResponse.json({ message: "Entry updated", entry });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meal-plans/entries/[entryId]
 * Delete an individual entry from a meal plan
 */
export async function DELETE(req: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    await connectToDatabase();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const userId = token && (await verifyToken(token));
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { entryId } = params;
    const mealPlan = await MealPlan.findOne({ "entries._id": entryId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    mealPlan.entries.id(entryId).remove();
    await mealPlan.save();
    return NextResponse.json({ message: "Entry deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

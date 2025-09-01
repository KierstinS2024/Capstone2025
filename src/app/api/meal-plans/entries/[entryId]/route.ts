// path: src/app/api/meal-plans/entries/[entryId]/route.ts
/**
 * Meal Plan Entry API (update or delete a specific entry)
 * PATCH: Update an existing meal plan entry (servings, day, meal type)
 * DELETE: Remove an entry from a meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// PATCH /api/meal-plans/entries/[entryId]
// Update the details of a meal plan entry
export async function PATCH(req: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const entryId = params.entryId;
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json({ message: "Invalid entry ID" }, { status: 400 });
    }

    const { dayOfWeek, mealType, servings } = await req.json();
    await connectToDatabase();

    // Find the meal plan containing this entry
    const mealPlan = await MealPlan.findOne({ "entries._id": entryId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan entry not found" }, { status: 404 });
    if (!mealPlan.userId.equals(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    // Locate the specific entry
    const entry = mealPlan.entries.id(entryId);
    if (!entry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    // Update fields if provided
    if (dayOfWeek) entry.dayOfWeek = dayOfWeek;
    if (mealType) entry.mealType = mealType;
    if (servings !== undefined) entry.servings = servings;

    await mealPlan.save();

    return NextResponse.json({ updatedEntry: entry }, { status: 200 });
  } catch (err) {
    console.error("Error updating meal plan entry:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
};

// DELETE /api/meal-plans/entries/[entryId]
// Remove a meal plan entry
export async function DELETE(req: NextRequest, { params }: { params: { entryId: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const entryId = params.entryId;
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json({ message: "Invalid entry ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the meal plan containing this entry
    const mealPlan = await MealPlan.findOne({ "entries._id": entryId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan entry not found" }, { status: 404 });
    if (!mealPlan.userId.equals(userId)) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    // Remove the entry
    const entry = mealPlan.entries.id(entryId);
    entry.remove();

    await mealPlan.save();

    return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting meal plan entry:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
};

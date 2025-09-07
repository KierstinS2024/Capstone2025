// src/app/api/meal-plans/[id]/entries/[entryId]/route.ts
/**
 * Meal Plan Entry API (Individual)
 * Handles updating or deleting a specific entry in a meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id, entryId } = params;
    const updates = await req.json(); // { recipeId?, day?, servings? }

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const entry = mealPlan.entries.id(entryId);
    if (!entry)
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    if (updates.recipeId !== undefined) entry.recipeId = updates.recipeId;
    if (updates.day !== undefined) entry.day = updates.day;
    if (updates.servings !== undefined) entry.servings = updates.servings;

    await mealPlan.save();

    return NextResponse.json(
      { message: "Entry updated", entry },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; entryId: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id, entryId } = params;
    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const entry = mealPlan.entries.id(entryId);
    if (!entry)
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    entry.remove();
    await mealPlan.save();

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

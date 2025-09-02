// path: src/app/api/meal-plans/[id]/route.ts
/**      
 * Meal Plan Update & Delete API
 *
 * PUT /api/meal-plans/[id]  → Update an existing meal plan
 * DELETE /api/meal-plans/[id] → Delete an existing meal plan
 *
 * JWT authentication required
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

// Update a meal plan
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Authorization required" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { id } = params;

    await connectToDatabase();

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    if (mealPlan.userId.toString() !== userId) {
      return NextResponse.json({ message: "Not authorized to edit this meal plan" }, { status: 403 });
    }

    // Update fields — allow notes and weekStartDate
    if (body.notes !== undefined) mealPlan.notes = body.notes;
    if (body.weekStartDate !== undefined) mealPlan.weekStartDate = body.weekStartDate;

    await mealPlan.save();

    return NextResponse.json({ message: "Meal plan updated", mealPlan });
  } catch (err) {
    console.error("Meal Plan update error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

// Delete a meal plan
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Authorization required" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = params;

    await connectToDatabase();

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    if (mealPlan.userId.toString() !== userId) {
      return NextResponse.json({ message: "Not authorized to delete this meal plan" }, { status: 403 });
    }

    await MealPlan.findByIdAndDelete(id);

    return NextResponse.json({ message: "Meal plan deleted" });
  } catch (err) {
    console.error("Meal Plan delete error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

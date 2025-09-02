// path: src/app/api/meal-plans/[id]/route.ts
/**
 * Meal Plan Update & Delete API
 * Handles updating or deleting a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

// Update a meal plan
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { id } = params;
    const { notes, weekStartDate } = await req.json();

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    if (notes !== undefined) mealPlan.notes = notes;
    if (weekStartDate !== undefined) mealPlan.weekStartDate = weekStartDate;

    await mealPlan.save();

    return NextResponse.json({ message: "Meal plan updated", mealPlan });
  } catch (err) {
    console.error("PUT /meal-plans/:id error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

// Delete a meal plan
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { id } = params;

    const mealPlan = await MealPlan.findOneAndDelete({ _id: id, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    return NextResponse.json({ message: "Meal plan deleted successfully" });
  } catch (err) {
    console.error("DELETE /meal-plans/:id error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

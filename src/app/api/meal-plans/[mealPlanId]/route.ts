// path: src/app/api/meal-plans/[mealPlanId]/route.ts
/**      
 * Meal Plan API
 * Handles retrieving, updating, and deleting a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * GET /api/meal-plans/[mealPlanId]
 * Retrieve a meal plan by ID
 */
export async function GET(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    await connectToDatabase();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { mealPlanId } = params;

    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    return NextResponse.json(mealPlan);
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/meal-plans/[mealPlanId]
 * Update a meal plan's notes or weekStartDate
 */
export async function PUT(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    await connectToDatabase();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { mealPlanId } = params;
    const updates = await req.json(); // expects { notes?, weekStartDate? }

    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    if (updates.notes !== undefined) mealPlan.notes = updates.notes;
    if (updates.weekStartDate !== undefined) mealPlan.weekStartDate = new Date(updates.weekStartDate);

    await mealPlan.save();

    return NextResponse.json(mealPlan);
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/meal-plans/[mealPlanId]
 * Delete a meal plan
 */
export async function DELETE(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    await connectToDatabase();
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { mealPlanId } = params;

    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json({ message: "Invalid meal plan ID" }, { status: 400 });
    }

    const mealPlan = await MealPlan.findOneAndDelete({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    return NextResponse.json({ message: "Meal plan deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

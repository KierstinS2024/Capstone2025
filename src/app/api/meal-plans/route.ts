// path: src/app/api/meal-plans/route.ts
/**      
 * Meal Plan CRUD API
 * Handles creation, reading, updating, and deletion of meal plans
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

connectToDatabase();

/**
 * POST /api/meal-plans
 * Create a new meal plan
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const { weekStartDate, notes, entries } = await req.json();

    if (!weekStartDate || !entries) {
      return NextResponse.json({ message: "Week start date and entries are required" }, { status: 400 });
    }

    const mealPlan = await MealPlan.create({
      userId,
      weekStartDate,
      notes: notes || "",
      entries,
    });

    return NextResponse.json({ data: mealPlan });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/meal-plans
 * Fetch all meal plans for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const mealPlans = await MealPlan.find({ userId }).sort({ weekStartDate: -1 });

    return NextResponse.json({ data: mealPlans });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/meal-plans
 * Update a meal plan
 */
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const { mealPlanId, weekStartDate, notes, entries } = await req.json();

    if (!mealPlanId) return NextResponse.json({ message: "Meal Plan ID required" }, { status: 400 });

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal Plan not found" }, { status: 404 });

    if (weekStartDate) mealPlan.weekStartDate = weekStartDate;
    if (notes !== undefined) mealPlan.notes = notes;
    if (entries) mealPlan.entries = entries;

    await mealPlan.save();

    return NextResponse.json({ data: mealPlan });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to update meal plan" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meal-plans
 * Delete a meal plan
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const { mealPlanId } = await req.json();
    if (!mealPlanId) return NextResponse.json({ message: "Meal Plan ID required" }, { status: 400 });

    const mealPlan = await MealPlan.findOneAndDelete({ _id: mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal Plan not found" }, { status: 404 });

    return NextResponse.json({ data: mealPlan });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}

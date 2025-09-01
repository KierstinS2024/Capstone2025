// path: src/app/api/meal-plans/route.ts
/**
 * Meal Plan API (collection)
 * Handles GET (list user's meal plans) and POST (create a new meal plan)
 */
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/meal-plans
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    await connectToDatabase();

    // Retrieve all meal plans for the authenticated user, sorted by newest first
    const mealPlans = await MealPlan.find({ userId }).sort({ weekStartDate: -1 });

    return NextResponse.json({ mealPlans });
  } catch (err) {
    console.error("Error fetching meal plans:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Unauthorized" }, { status: 401 });
  }
}

// POST /api/meal-plans
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    const { weekStartDate, notes } = await req.json();

    if (!weekStartDate) {
      return NextResponse.json({ message: "Week start date is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Create a new meal plan
    const newMealPlan = await MealPlan.create({
      userId: new mongoose.Types.ObjectId(userId),
      weekStartDate: new Date(weekStartDate),
      notes: notes || "",
      entries: [],
    });

    return NextResponse.json({ mealPlan: newMealPlan }, { status: 201 });
  } catch (err) {
    console.error("Error creating meal plan:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

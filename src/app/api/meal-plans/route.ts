// src/app/api/meal-plans/route.ts
/**
 * Meal Plan API
 * Handles creating and listing meal plans
 * Fully JWT-protected using requireAuth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";

// --- GET all meal plans for the logged-in user ---
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req); // secure auth check

    const mealPlans = await MealPlan.find({ userId }).sort({
      weekStartDate: -1,
    });

    return NextResponse.json({ mealPlans }, { status: 200 });
  } catch (err) {
    console.error("GET /meal-plans error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// --- POST create a new meal plan ---
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req); // secure auth check

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { weekStartDate, notes, entries } = body;

    if (!weekStartDate) {
      return NextResponse.json(
        { message: "weekStartDate is required" },
        { status: 400 }
      );
    }

    const mealPlan = await MealPlan.create({
      userId,
      weekStartDate,
      notes: notes || "",
      entries: entries || [],
    });

    return NextResponse.json({ mealPlan }, { status: 201 });
  } catch (err) {
    console.error("POST /meal-plans error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

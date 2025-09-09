// Path: src/app/api/meal-plans/route.ts
"use server";

/**
 * Meal Plans Collection API
 * ------------------------
 * GET  → List all meal plans for the current user
 * POST → Create a new meal plan (JWT required)
 * Features:
 * - Lean queries for performance
 * - Zod validation for POST
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import { mealPlanFormSchema } from "@/schemas/mealPlanForm";

/**
 * GET /api/meal-plans
 * - Returns all meal plans for authenticated user
 * - Sorted by weekStartDate
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const mealPlans = await MealPlan.find({ userId })
      .sort({ weekStartDate: 1 })
      .lean();
    return NextResponse.json({ success: true, data: mealPlans });
  } catch (err) {
    console.error("GET /api/meal-plans error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to fetch meal plans",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/meal-plans
 * - Creates a new meal plan (JWT required)
 * - Validates input via Zod
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const body = await req.json();
    const parsed = mealPlanFormSchema.parse(body);

    const newPlan = await MealPlan.create({ ...parsed, userId });

    return NextResponse.json({ success: true, data: newPlan }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meal-plans error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to create meal plan",
      },
      { status: 500 }
    );
  }
}

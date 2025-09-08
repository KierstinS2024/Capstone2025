// Path: src/app/api/meal-plans/[id]/route.ts
"use server";

/**
 * Meal Plans Single API
 * --------------------
 * GET    → Retrieve a meal plan by ID
 * PUT    → Update a meal plan (JWT required)
 * DELETE → Delete a meal plan (JWT required)
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import { MealPlanFormSchema } from "@/schemas/mealPlanForm";

/**
 * GET /api/meal-plans/[id]
 * Fetch a single meal plan belonging to the authenticated user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    const mealPlan = await MealPlan.findOne({ _id: id, userId }).lean();
    if (!mealPlan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mealPlan });
  } catch (err) {
    console.error("GET /api/meal-plans/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to fetch meal plan",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/meal-plans/[id]
 * Update a meal plan by ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    const body = await req.json();
    const parsed = MealPlanFormSchema.parse(body); // Zod validation

    const updatedPlan = await MealPlan.findOneAndUpdate(
      { _id: id, userId },
      parsed,
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (err) {
    console.error("PUT /api/meal-plans/[id] error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((issue) => issue.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to update meal plan",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meal-plans/[id]
 * Remove a meal plan by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    const deletedPlan = await MealPlan.findOneAndDelete({ _id: id, userId });

    if (!deletedPlan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found" },

        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedPlan });
  } catch (err) {
    console.error("DELETE /api/meal-plans/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to delete meal plan",
      },
      { status: 500 }
    );
  }
}

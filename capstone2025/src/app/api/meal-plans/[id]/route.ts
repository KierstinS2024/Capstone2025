// Path: src/app/api/meal-plans/[id]/route.ts
"use server";

/**
 * Meal Plan Single API
 * -------------------
 * GET    → Retrieve a single meal plan by ID
 * PUT    → Update a meal plan (JWT required)
 * DELETE → Delete a meal plan (JWT required)
 * Features:
 * - Lean query for GET
 * - Zod validation for PUT
 * - Cookie-based JWT auth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import mongoose from "mongoose";

// Zod schema for PUT / update meal plan
const updateMealPlanSchema = z.object({
  title: z.string().nonempty("Title is required"),
  date: z.string().optional(),
  recipes: z
    .array(
      z.object({
        recipeId: z.string().min(1, "Recipe ID is required"),
        servings: z.number().positive("Servings must be positive").optional(),
      })
    )
    .optional(),
});

/**
 * GET /api/meal-plans/[id]
 * - Returns a single meal plan
 * - Lean query for performance
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const plan = await MealPlan.findOne({ _id: id, userId }).lean();
    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
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
 * - Updates a meal plan
 * - Validates input with Zod
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateMealPlanSchema.parse(body);

    const updatedPlan = await MealPlan.findOneAndUpdate(
      { _id: id, userId },
      parsed,
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Meal plan updated",
      data: updatedPlan,
    });
  } catch (err) {
    console.error("PUT /api/meal-plans/[id] error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
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
 * - Deletes a meal plan
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const deletedPlan = await MealPlan.findOneAndDelete({ _id: id, userId });
    if (!deletedPlan) {
      return NextResponse.json(
        { success: false, message: "Meal plan not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Meal plan deleted successfully",
    });
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

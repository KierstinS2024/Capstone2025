// path: src/app/api/meal-plans/[id]/route.ts
/**
 * Meal Plan API
 * - GET: fetch a single meal plan
 * - PUT: update a meal plan (JWT-protected, owner-only)
 * - DELETE: delete a meal plan (JWT-protected, owner-only)
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { requireAuth } from "@/lib/authHelpers";

export interface MealPlanEntry {
  recipeId: string;
  servings: number;
  [key: string]: any;
}

export interface MealPlanBody {
  title?: string;
  weekStartDate?: Date;
  entries?: MealPlanEntry[];
  notes?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// GET /api/meal-plans/:id - fetch single meal plan
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const mealPlan = await MealPlan.findById(id)
      .populate("entries.recipeId")
      .lean();
    if (!mealPlan) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof mealPlan>>({
      success: true,
      data: mealPlan,
    });
  } catch (err) {
    console.error("GET /api/meal-plans/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/meal-plans/:id - update meal plan (owner-only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Only owner can update
    if (mealPlan.userId?.toString() !== userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Forbidden: You do not own this meal plan" },
        { status: 403 }
      );
    }

    const updates: MealPlanBody = await req.json();
    Object.assign(mealPlan, updates);
    await mealPlan.save();

    return NextResponse.json<ApiResponse<typeof mealPlan>>({
      success: true,
      data: mealPlan,
      message: "Meal plan updated successfully",
    });
  } catch (err) {
    console.error("PUT /api/meal-plans/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/meal-plans/:id - delete meal plan (owner-only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Only owner can delete
    if (mealPlan.userId?.toString() !== userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Forbidden: You do not own this meal plan" },
        { status: 403 }
      );
    }

    await mealPlan.deleteOne();

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Meal plan deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/meal-plans/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// src/app/api/meal-plans/[id]/route.ts
"use client"; // Client directive if needed for hooks inside helpers

/**
 * MealPlan API routes for a single meal plan by ID
 * Supports GET, PUT, DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { MealPlan } from "@/models/MealPlan";

// Helper to extract ID from request URL
const getIdFromReq = (req: NextRequest) => {
  const url = new URL(req.url);
  return url.pathname.split("/").pop();
};

/** GET: Fetch a single meal plan by ID */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    return NextResponse.json(mealPlan, { status: 200 });
  } catch (error) {
    console.error("GET /meal-plans/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}

/** PUT: Update a meal plan by ID */
export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const data = await req.json();
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedMealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    return NextResponse.json(updatedMealPlan, { status: 200 });
  } catch (error) {
    console.error("PUT /meal-plans/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update meal plan" },
      { status: 500 }
    );
  }
}

/** DELETE: Delete a meal plan by ID */
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const deletedMealPlan = await MealPlan.findByIdAndDelete(id);
    if (!deletedMealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Meal plan deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /meal-plans/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}

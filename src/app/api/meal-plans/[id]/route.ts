// src/app/api/meal-plans/[id]/route.ts
/**
 * API for single meal plan by ID
 * GET / PUT / DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { MealPlan } from "@/models/MealPlan";

// Extract ID from URL
const getIdFromReq = (req: NextRequest) =>
  new URL(req.url).pathname.split("/").pop();

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

// src/app/api/meal-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { MealPlan } from "@/models/MealPlan";

// GET all meal plans
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const mealPlans = await MealPlan.find({}).lean();
    return NextResponse.json(mealPlans, { status: 200 });
  } catch (err) {
    console.error("Error fetching meal plans:", err);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

// POST a new meal plan
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.recipes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMealPlan = await MealPlan.create({
      name: data.name,
      recipes: data.recipes,
      date: data.date || new Date(),
    });

    return NextResponse.json(newMealPlan, { status: 201 });
  } catch (err) {
    console.error("Error creating meal plan:", err);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

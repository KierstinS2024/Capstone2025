// ===========================================
// PATH: src/app/api/meal-plans/route.ts
// Collection-level API routes for Meal Plans
// - GET all meal plans for a user
// - POST a new weekly meal plan
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { getAllMealPlans, createMealPlan } from "@/lib/db";

// -------------------------------------------
// GET → Fetch all meal plans for a user
// -------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  try {
    const plans = await getAllMealPlans(userEmail);
    return NextResponse.json(plans);
  } catch (err) {
    console.error("GET /api/meal-plans failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// POST → Create a new weekly meal plan
// -------------------------------------------
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  try {
    const body = await req.json();

    // Ensure startDate is provided
    const startDateStr = body.startDate;
    if (!startDateStr)
      return NextResponse.json({ error: "Missing startDate" }, { status: 400 });

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime()))
      return NextResponse.json({ error: "Invalid startDate" }, { status: 400 });

    // Calculate endDate (+6 days)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Normalize meals if missing
    const meals: Record<
      string,
      { breakfast?: string; lunch?: string; dinner?: string }
    > = body.meals || {};

    // Create the plan using updated db.ts helper
    const newPlan = await createMealPlan({
      ...body,
      author: userEmail, // must match MealPlan field
      weekStartDate: startDate.toISOString().split("T")[0],
      weekEndDate: endDate.toISOString().split("T")[0],
      meals,
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (err: any) {
    // Duplicate error handling (two possible sources)
    if (
      err.message?.includes("User already has an active meal plan") || // thrown in db.ts
      err.code === 11000 // Mongo duplicate key error
    ) {
      return NextResponse.json(
        { error: "Meal plan already exists for this user" },
        { status: 409 }
      );
    }

    console.error("POST /api/meal-plans failed:", err);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

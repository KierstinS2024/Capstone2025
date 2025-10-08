// ===========================================
// PATH: src/app/api/meal-plans/route.ts
// Collection-level API routes for Meal Plans
// - GET all meal plans for a user
// - POST a new meal plan (with start/end dates)
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { getAllMealPlans, createMealPlan } from "@/lib/db";

// -------------------------------------------
// GET → Fetch all meal plans for a given user
// Requires: ?userEmail=someone@example.com
// -------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  // Guard: userEmail is required
  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

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
// POST → Create a new meal plan
// Requires: { startDate, endDate, meals? }
// Also requires ?userEmail in the query
// -------------------------------------------
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  // Guard: must include email
  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { startDate: startDateStr, endDate: endDateStr } = body;

    // Guard: both start and end are required
    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "Missing startDate or endDate" },
        { status: 400 }
      );
    }

    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Guard: ensure dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date(s)" }, { status: 400 });
    }

    // Helper → generate a continuous set of days between start and end
    function generateEmptyMeals(
      start: Date,
      end: Date,
      existingMeals: Record<string, any> = {}
    ) {
      const meals: Record<
        string,
        { breakfast: string; lunch: string; dinner: string }
      > = {};

      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        meals[dateStr] = existingMeals[dateStr] || {
          breakfast: "",
          lunch: "",
          dinner: "",
        };
        current.setDate(current.getDate() + 1);
      }

      return meals;
    }

    const meals = generateEmptyMeals(startDate, endDate, body.meals || {});

    // ✅ IMPORTANT: Pass actual Date objects to Mongoose
    const newPlan = await createMealPlan({
      ...body,
      author: userEmail,
      startDate, // Date object, not string
      endDate, // Date object, not string
      meals,
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (err: any) {
    if (
      err.message?.includes("User already has an active meal plan") ||
      err.code === 11000
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

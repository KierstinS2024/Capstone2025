// ===========================================
// PATH: src/app/api/meal-plans/week/[startDate]/route.ts
// Weekly Meal Plan API
// - GET  : Fetch a plan by weekStartDate
// - POST : Create a new plan for that week
// - PATCH: Update meals in that week’s plan
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { getAllMealPlans, createMealPlan, updateMealPlanById } from "@/lib/db";

// -------------------------------------------
// Utility: Normalize meals to full structure
// -------------------------------------------
function normalizeMeals(
  meals: Record<
    string,
    Partial<Record<"breakfast" | "lunch" | "dinner", string | null>>
  > = {}
) {
  const normalized: Record<
    string,
    { breakfast: string | null; lunch: string | null; dinner: string | null }
  > = {};
  for (const [day, slots] of Object.entries(meals)) {
    normalized[day] = {
      breakfast: slots?.breakfast ?? null,
      lunch: slots?.lunch ?? null,
      dinner: slots?.dinner ?? null,
    };
  }
  return normalized;
}

// -------------------------------------------
// GET → Fetch weekly meal plan
// -------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { startDate: string } }
) {
  const { startDate } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  try {
    const allPlans = await getAllMealPlans(userEmail);
    const plan = allPlans.find((p) => p.weekStartDate === startDate);

    if (!plan) return NextResponse.json(null);

    plan.meals = normalizeMeals(plan.meals);
    return NextResponse.json(plan);
  } catch (err) {
    console.error("GET /api/meal-plans/week failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// POST → Create a new weekly meal plan
// -------------------------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { startDate: string } }
) {
  const { startDate } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  try {
    const body = await req.json();

    // Derive weekEndDate
    const start = new Date(startDate);
    if (isNaN(start.getTime()))
      return NextResponse.json({ error: "Invalid startDate" }, { status: 400 });

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const weekEndDate = end.toISOString().split("T")[0];

    const newPlan = await createMealPlan({
      ...body,
      author: userEmail,
      weekStartDate: startDate,
      weekEndDate,
      meals: normalizeMeals(body.meals),
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (err: any) {
    // Handle both db.ts custom error and Mongo duplicate key error
    if (
      err.message?.includes("User already has an active meal plan") ||
      err.code === 11000
    ) {
      return NextResponse.json(
        { error: "Meal plan already exists for this user" },
        { status: 409 }
      );
    }

    console.error("POST /api/meal-plans/week failed:", err);
    return NextResponse.json(
      { error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// PATCH → Update meals in weekly plan
// -------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: { startDate: string } }
) {
  const { startDate } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  try {
    const body = await req.json();
    const allPlans = await getAllMealPlans(userEmail);
    const plan = allPlans.find((p) => p.weekStartDate === startDate);

    if (!plan)
      return NextResponse.json(
        { error: "No meal plan found for this week" },
        { status: 404 }
      );

    // Merge meals safely
    const updatedMeals = {
      ...normalizeMeals(plan.meals),
      ...normalizeMeals(body.meals),
    };

    const updatedPlan = await updateMealPlanById(plan.id, {
      ...body,
      meals: updatedMeals,
    });

    return NextResponse.json(updatedPlan);
  } catch (err) {
    console.error("PATCH /api/meal-plans/week failed:", err);
    return NextResponse.json(
      { error: "Failed to update meal plan" },
      { status: 500 }
    );
  }
}

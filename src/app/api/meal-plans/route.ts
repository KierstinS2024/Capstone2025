// ===========================================
// PATH: src/app/api/meal-plans/route.ts
// Handles GET all meal plans & POST new meal plan
// Prevents overlapping plans
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

/**
 * Normalize meals object so each day has breakfast/lunch/dinner slots.
 */
function normalizeMeals(meals: any = {}) {
  const normalized: Record<
    string,
    { breakfast: string | null; lunch: string | null; dinner: string | null }
  > = {};
  Object.entries(meals).forEach(([day, slots]) => {
    const s = slots as Partial<
      Record<"breakfast" | "lunch" | "dinner", string | null>
    >;
    normalized[day] = {
      breakfast: s?.breakfast ?? null,
      lunch: s?.lunch ?? null,
      dinner: s?.dinner ?? null,
    };
  });
  return normalized;
}

/**
 * Format MongoDB doc for frontend
 */
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate: doc.startDate,
    endDate: doc.endDate,
    meals: normalizeMeals(doc.meals),
    user: doc.user || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// -----------------------------
// GET /api/meal-plans
// -----------------------------
export async function GET() {
  await connectDB();
  const plans = await MealPlan.find().lean();
  return NextResponse.json(plans.map(formatMealPlan));
}

// -----------------------------
// POST /api/meal-plans
// -----------------------------
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { startDate, endDate, title } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid startDate or endDate" },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "endDate cannot be before startDate" },
        { status: 400 }
      );
    }

    // -----------------------------
    // Check for overlapping plans
    // -----------------------------
    const overlap = await MealPlan.findOne({
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
    }).lean();

    if (overlap) {
      return NextResponse.json(
        { error: "New meal plan overlaps with an existing plan" },
        { status: 400 }
      );
    }

    const safeBody = {
      ...body,
      meals: normalizeMeals(body.meals),
      title: title || `Meal Plan ${startDate} → ${endDate}`,
    };

    const plan = await MealPlan.create(safeBody);
    return NextResponse.json(formatMealPlan(plan));
  } catch (err: any) {
    console.error("Failed to create meal plan:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

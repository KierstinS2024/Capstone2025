// ===========================================
// PATH: src/app/api/meal-plans/week/[date]/route.ts
//
// API route for fetching a meal plan by week start date
// Handles:
//   - GET: return meal plan for given week
//
// Best practices implemented:
//   - Always scoped to the authenticated user
//   - Uses real Date queries in Mongo
//   - Converts back to ISO string for frontend
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// -------------------------------------------
// Helper: normalizeMeals
// -------------------------------------------
function normalizeMeals(
  meals: Record<string, Partial<Record<"breakfast" | "lunch" | "dinner", string | null>>> = {}
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
// Helper: formatMealPlan
// -------------------------------------------
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate:
      doc.startDate instanceof Date
        ? doc.startDate.toISOString().split("T")[0]
        : doc.startDate,
    endDate:
      doc.endDate instanceof Date
        ? doc.endDate.toISOString().split("T")[0]
        : doc.endDate,
    meals: normalizeMeals(doc.meals),
    user: doc.user?.toString() || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// -----------------------------
// GET /api/meal-plans/week/:date
// Returns the plan covering a given date
// Example: GET /api/meal-plans/week/2025-09-22
// -----------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const queryDate = new Date(params.date);
    if (isNaN(queryDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date parameter" },
        { status: 400 }
      );
    }

    // ✅ Find plan that covers this date
    const plan = await MealPlan.findOne({
      user: payload.id,
      startDate: { $lte: queryDate },
      endDate: { $gte: queryDate },
    }).lean();

    if (!plan) {
      return NextResponse.json(null);
    }

    return NextResponse.json(formatMealPlan(plan));
  } catch (err: any) {
    console.error("Failed to fetch weekly meal plan:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch weekly meal plan" },
      { status: 500 }
    );
  }
}

// ===========================================
// PATH: src/app/api/meal-plans/week/[date]/route.ts
//
// GET → Returns the user's active meal plan if it overlaps the given week
// - Since only one plan exists per user, this returns [plan] or []
// - Overlap check: plan.startDate <= weekEnd && plan.endDate >= weekStart
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// -------------------------------------------
// Helper: format MongoDB doc for frontend
// Converts ObjectIds + Dates to plain JSON
// -------------------------------------------
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate: doc.startDate,
    endDate: doc.endDate,
    meals: doc.meals || {},
    user: doc.user?.toString() || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// -----------------------------
// GET /api/meal-plans/week/[date]
// Returns [plan] if active meal plan overlaps the given week
// Otherwise returns []
// -----------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  await connectDB();

  // ✅ Authenticate
  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = payload.id;

  // ✅ Validate date
  const weekStart = new Date(params.date);
  if (isNaN(weekStart.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  // ✅ Fetch the only meal plan for this user
  const plan = (await MealPlan.findOne({ user: userId }).lean()) as
    | (typeof MealPlan.schema.obj & { startDate: Date; endDate: Date })
    | null;

  // ✅ Check overlap (plan exists & has start/end dates)
  if (plan && plan.startDate && plan.endDate) {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);

    if (start <= weekEnd && end >= weekStart) {
      return NextResponse.json([formatMealPlan(plan)]);
    }
  }

  // No overlap → return empty array
  return NextResponse.json([]);
}

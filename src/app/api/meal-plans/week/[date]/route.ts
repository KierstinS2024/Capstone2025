// ===========================================
// PATH: src/app/api/meal-plans/week/[date]/route.ts
// Get all meal plans for a specific week starting from a date
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

/** Reuse the same normalizer/formatter */
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

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  await connectDB();

  const userId = await getUserFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startDate = new Date(params.date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  const weekPlans = await MealPlan.find({
    user: userId,
    startDate: { $gte: startDate, $lte: endDate },
  }).lean();

  return NextResponse.json(weekPlans.map(formatMealPlan));
}

// ===========================================
// PATH: src/app/api/meal-plans/route.ts
// GET all meal plans and POST a new meal plan
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

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

// GET /api/meal-plans
export async function GET() {
  await connectDB();
  const plans = await MealPlan.find().lean();
  return NextResponse.json(plans.map(formatMealPlan));
}

// POST /api/meal-plans
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  // normalize meals before saving
  const safeBody = { ...body, meals: normalizeMeals(body.meals) };

  const plan = await MealPlan.create(safeBody);
  return NextResponse.json(formatMealPlan(plan));
}

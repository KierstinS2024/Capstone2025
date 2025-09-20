// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
// GET, PUT, DELETE a single meal plan by ID
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

/**
 * Normalize MongoDB document for frontend.
 */
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate: doc.startDate,
    endDate: doc.endDate,
    meals: doc.meals || {},
    user: doc.user || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// GET /api/meal-plans/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const plan = await MealPlan.findById(params.id).lean();
  if (!plan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }
  return NextResponse.json(formatMealPlan(plan));
}

// PUT /api/meal-plans/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const updated = await MealPlan.findByIdAndUpdate(params.id, body, {
    new: true,
  }).lean();
  if (!updated) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }
  return NextResponse.json(formatMealPlan(updated));
}

// DELETE /api/meal-plans/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await MealPlan.findByIdAndDelete(params.id).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

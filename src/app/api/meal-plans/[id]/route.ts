// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
// Handles GET, PUT, DELETE a single meal plan by ID
// Updated for Next.js 15 dynamic API routes
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

/**
 * Format MongoDB document for frontend
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

// -----------------------------
// GET /api/meal-plans/:id
// -----------------------------
export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const id = params.id;

  if (!id)
    return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });

  await connectDB();
  const plan = await MealPlan.findById(id).lean();

  if (!plan)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  return NextResponse.json(formatMealPlan(plan));
}

// -----------------------------
// PUT /api/meal-plans/:id
// -----------------------------
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const id = params.id;

  if (!id)
    return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });

  await connectDB();
  const body = await req.json();

  // Optional: prevent overlapping dates
  if (body.startDate && body.endDate) {
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);

    const overlap = await MealPlan.findOne({
      _id: { $ne: id },
      $or: [{ startDate: { $lte: end } }, { endDate: { $gte: start } }],
    }).lean();

    if (overlap) {
      return NextResponse.json(
        { error: "Updated dates overlap an existing plan" },
        { status: 400 }
      );
    }
  }

  const updated = await MealPlan.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();

  if (!updated)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  return NextResponse.json(formatMealPlan(updated));
}

// -----------------------------
// DELETE /api/meal-plans/:id
// -----------------------------
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const id = params.id;

  if (!id)
    return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });

  await connectDB();
  const deleted = await MealPlan.findByIdAndDelete(id).lean();

  if (!deleted)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}

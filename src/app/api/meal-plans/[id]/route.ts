// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
//
// Handles GET, PUT, DELETE for a single meal plan
// - One plan per user
// - Scoped by userId to prevent cross-user access
// - PUT safely merges updates (prevents $__parent errors)
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// Helper: format MongoDB doc for frontend
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

// GET /api/meal-plans/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = payload.id;

  const { id } = await context.params; // ✅ await required
  const plan = await MealPlan.findOne({ _id: id, user: userId }).lean();
  if (!plan)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  return NextResponse.json(formatMealPlan(plan));
}

// PUT /api/meal-plans/:id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = payload.id;

  const { id } = await context.params; // ✅
  const rawBody = await req.json();
  const body = JSON.parse(JSON.stringify(rawBody)); // ✅ sanitize

  const updatePayload: any = {};
  if (body.title !== undefined) updatePayload.title = body.title;
  if (body.startDate !== undefined) updatePayload.startDate = body.startDate;
  if (body.endDate !== undefined) updatePayload.endDate = body.endDate;
  if (body.meals !== undefined) updatePayload.meals = body.meals;

  const updated = await MealPlan.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).lean();

  if (!updated)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  return NextResponse.json(formatMealPlan(updated));
}

// DELETE /api/meal-plans/:id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = payload.id;

  const { id } = await context.params; // ✅
  const deleted = await MealPlan.findOneAndDelete({
    _id: id,
    user: userId,
  }).lean();
  if (!deleted)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}

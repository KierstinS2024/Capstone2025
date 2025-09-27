// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
//
// API route for single meal plan by ID
// Handles:
//   - PUT: update an existing plan (title, meals, dates)
//   - DELETE: remove an existing plan
//
// Key fixes for drag-and-drop issues:
//   - Clone incoming meals into plain JS to strip Mongoose internals
//   - Normalize all meals to ensure breakfast/lunch/dinner exist
//   - Safe update via findOneAndUpdate (no $set injection)
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// -------------------------------------------
// Helper: normalizeMeals
// Ensures each day has breakfast/lunch/dinner keys
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
// Converts MongoDB doc → frontend object
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
// PUT /api/meal-plans/:id
// Updates a meal plan
// -----------------------------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  // -----------------------------
  // Authenticate user
  // -----------------------------
  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // -----------------------------
    // Build update payload
    // -----------------------------
    const updatePayload: any = {};

    if (body.title !== undefined) updatePayload.title = body.title;

    if (body.startDate) {
      const start = new Date(body.startDate);
      if (isNaN(start.getTime()))
        return NextResponse.json(
          { error: "Invalid startDate" },
          { status: 400 }
        );
      updatePayload.startDate = start;
    }

    if (body.endDate) {
      const end = new Date(body.endDate);
      if (isNaN(end.getTime()))
        return NextResponse.json({ error: "Invalid endDate" }, { status: 400 });
      updatePayload.endDate = end;
    }

    if (body.meals !== undefined) {
      // ✅ Step 1: Deep clone into plain JS to strip Mongoose internals like $__parent
      const plainMeals = JSON.parse(JSON.stringify(body.meals));

      // ✅ Step 2: Normalize all meals to guarantee breakfast/lunch/dinner
      updatePayload.meals = normalizeMeals(plainMeals);
    }

    // -----------------------------
    // Perform safe update
    // -----------------------------
    const updated = await MealPlan.findOneAndUpdate(
      { _id: params.id, user: payload.id },
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // -----------------------------
    // Return normalized plan to frontend
    // -----------------------------
    return NextResponse.json(formatMealPlan(updated));
  } catch (err: any) {
    console.error("Failed to update meal plan:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update meal plan" },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE /api/meal-plans/:id
// Deletes a meal plan (unchanged)
// -----------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const deleted = await MealPlan.findOneAndDelete({
      _id: params.id,
      user: payload.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to delete meal plan:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}

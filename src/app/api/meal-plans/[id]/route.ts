// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
// Routes for a single Meal Plan
// Supports: GET, PATCH, DELETE
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import {
  getMealPlanById,
  updateMealPlanById,
  deleteMealPlanById,
} from "@/lib/db";

// -------------------------------------------
// GET → Fetch one meal plan by ID
// -------------------------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is async in Next.js app router
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  const plan = await getMealPlanById(id);

  // Ensure plan exists and belongs to the user
  if (!plan || plan.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(plan);
}

// -------------------------------------------
// PATCH → Update a meal plan (e.g., meals)
// -------------------------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  const plan = await getMealPlanById(id);
  if (!plan || plan.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Merge updates into plan
  const updates = await req.json();
  const updatedPlan = await updateMealPlanById(id, updates);

  return NextResponse.json(updatedPlan);
}

// -------------------------------------------
// DELETE → Remove a meal plan
// -------------------------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });
  }

  const plan = await getMealPlanById(id);
  if (!plan || plan.author !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteMealPlanById(id);
  return NextResponse.json({ success: true });
}

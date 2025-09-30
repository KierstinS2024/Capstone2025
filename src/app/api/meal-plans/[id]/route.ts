// ===========================================
// PATH: src/app/api/meal-plans/[id]/route.ts
// GET, PATCH, DELETE a single meal plan by ID
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import {
  getMealPlanById,
  updateMealPlanById,
  deleteMealPlanById,
} from "@/lib/db";

// GET → Fetch a single meal plan by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  const plan = await getMealPlanById(id);
  if (!plan || plan.author !== userEmail)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(plan);
}

// PATCH → Update a meal plan
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  const plan = await getMealPlanById(id);
  if (!plan || plan.author !== userEmail)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updates = await req.json();
  const updatedPlan = await updateMealPlanById(id, updates);
  return NextResponse.json(updatedPlan);
}

// DELETE → Delete a meal plan
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  if (!userEmail)
    return NextResponse.json({ error: "Missing userEmail" }, { status: 400 });

  const plan = await getMealPlanById(id);
  if (!plan || plan.author !== userEmail)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteMealPlanById(id);
  return NextResponse.json({ success: true });
}

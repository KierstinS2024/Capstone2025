// ===========================================
// src/app/api/meal-plans/[id]/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

interface Params {
  params: { id: string };
}

// GET single plan
export async function GET(_: Request, { params }: Params) {
  await connectDB();
  const plan = await MealPlan.findById(params.id);
  return NextResponse.json(plan);
}

// PUT update
export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  const body = await req.json();
  const updated = await MealPlan.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

// DELETE remove
export async function DELETE(_: Request, { params }: Params) {
  await connectDB();
  await MealPlan.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}

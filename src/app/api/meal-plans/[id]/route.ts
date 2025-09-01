// src/app/api/meal-plans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";

// Helper to get userId from the Authorization header
function getUserIdFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.split(" ")[1]);
}

// GET: Retrieve a single meal plan by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const plan = await MealPlan.findById(params.id);
  if (!plan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

  if (plan.userId.toString() !== userId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json(plan, { status: 200 });
}

// PUT: Update a meal plan (ownership enforced)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const plan = await MealPlan.findById(params.id);
  if (!plan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

  if (plan.userId.toString() !== userId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  plan.weekStartDate = body.weekStartDate ?? plan.weekStartDate;
  plan.notes = body.notes ?? plan.notes;
  plan.entries = body.entries ?? plan.entries;

  await plan.save();
  return NextResponse.json(plan, { status: 200 });
}

// DELETE: Remove a meal plan (ownership enforced)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const plan = await MealPlan.findById(params.id);
  if (!plan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

  if (plan.userId.toString() !== userId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  await plan.deleteOne();
  return NextResponse.json({ message: "Meal plan deleted" }, { status: 200 });
}

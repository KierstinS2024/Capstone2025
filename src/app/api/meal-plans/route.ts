// ===========================================
// src/app/api/meal-plans/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";

// GET all meal plans
export async function GET() {
  await connectDB();
  const plans = await MealPlan.find();
  return NextResponse.json(plans);
}

// POST create new meal plan
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const plan = await MealPlan.create(body);
  return NextResponse.json(plan);
}

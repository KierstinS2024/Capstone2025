// src/app/api/meal-plans/week/[date]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyAuth } from "@/lib/serverAuth";

export async function GET(req: Request, { params }: { params: { date: string } }) {
  await connectDB();
  const userId = await verifyAuth(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const startDate = new Date(params.date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  const weekPlans = await MealPlan.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  return NextResponse.json(weekPlans);
}

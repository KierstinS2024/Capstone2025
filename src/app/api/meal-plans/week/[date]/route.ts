// path: src/app/api/meal-plans/week/[date]/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { MealPlan } from "@/models/MealPlan";
import { verifyAuth } from "@/lib/serverAuth";

/** GET all meal plans for the week containing [date] */
export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  const user = await verifyAuth(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDB();
    const inputDate = new Date(params.date);
    if (isNaN(inputDate.getTime()))
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });

    const startOfWeek = new Date(inputDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const plans = await MealPlan.find({
      userId: user.id,
      "meals.date": { $gte: startOfWeek, $lte: endOfWeek },
    }).lean();

    return NextResponse.json(plans, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch weekly meal plans" },
      { status: 500 }
    );
  }
}

// path: src/app/api/meal-plans/route.ts
/**
 * Meal Plan API
 * Handles creating and listing meal plans
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

function getToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

// GET all meal plans for the user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const mealPlans = await MealPlan.find({ userId }).sort({ weekStartDate: -1 });

    return NextResponse.json({ mealPlans });
  } catch (err) {
    console.error("GET /meal-plans error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

// POST - create a new meal plan
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    const { weekStartDate, notes, entries } = await req.json();

    if (!weekStartDate) {
      return NextResponse.json({ message: "weekStartDate is required" }, { status: 400 });
    }

    const mealPlan = await MealPlan.create({
      userId,
      weekStartDate,
      notes: notes || "",
      entries: entries || [],
    });

    return NextResponse.json({ message: "Meal plan created", mealPlan });
  } catch (err) {
    console.error("POST /meal-plans error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

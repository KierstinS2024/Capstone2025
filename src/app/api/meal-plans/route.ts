// src/app/api/meal-plans/route.ts
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

// GET: List all meal plans for the authenticated user
export async function GET(req: NextRequest) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const plans = await MealPlan.find({ userId });
    return NextResponse.json({ plans }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching meal plans" }, { status: 500 });
  }
}

// POST: Create a new meal plan
export async function POST(req: NextRequest) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const body = await req.json();
    const { weekStartDate, notes, entries } = body;

    const newPlan = await MealPlan.create({
      userId,
      weekStartDate,
      notes,
      entries: entries || [],
    });

    return NextResponse.json({ plan: newPlan }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating meal plan" }, { status: 500 });
  }
}

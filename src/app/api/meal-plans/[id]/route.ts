// src/app/api/meal-plans/[id]/route.ts
/**
 * Meal Plan Detail API
 * Handles getting, updating, or deleting a specific meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

// --- Helper to extract JWT ---
function getToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

// --- GET a single meal plan ---
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    // FIX: await params before using
    const { id } = await context.params;

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    return NextResponse.json({ mealPlan }, { status: 200 });
  } catch (err) {
    console.error("GET /meal-plans/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// --- PUT update a meal plan ---
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    // FIX: await params before using
    const { id } = await context.params;

    const { weekStartDate, notes } = await req.json();

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    if (weekStartDate !== undefined) mealPlan.weekStartDate = weekStartDate;
    if (notes !== undefined) mealPlan.notes = notes;

    await mealPlan.save();

    return NextResponse.json(
      { message: "Meal plan updated", mealPlan },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /meal-plans/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// --- DELETE a meal plan ---
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    // FIX: await params before using
    const { id } = await context.params;

    const mealPlan = await MealPlan.findOneAndDelete({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Meal plan deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /meal-plans/:id error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// src/app/api/meal-plans/[id]/entries/[entryId]/route.ts
/**
 * Meal Plan Entry API
 * Update or delete a specific entry in a meal plan
 * Fully JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

// --- Extract JWT from Authorization header ---
function getToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

// --- PATCH update an entry ---
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string; entryId: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    const { id, entryId } = context.params;
    const { servings, mealType, dayOfWeek } = await req.json();

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const entry = mealPlan.entries.id(entryId);
    if (!entry)
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    if (servings !== undefined) entry.servings = servings;
    if (mealType) entry.mealType = mealType;
    if (dayOfWeek) entry.dayOfWeek = dayOfWeek;

    await mealPlan.save();
    return NextResponse.json(
      { message: "Entry updated", entry },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// --- DELETE remove an entry ---
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string; entryId: string } }
) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });

    const { id, entryId } = context.params;

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    const entry = mealPlan.entries.id(entryId);
    if (!entry)
      return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    entry.remove();
    await mealPlan.save();

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

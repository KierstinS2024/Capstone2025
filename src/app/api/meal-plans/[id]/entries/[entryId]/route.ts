// path: src/app/api/meal-plans/[id]/entries/[entryId]/route.ts
/**
 * PATCH / DELETE /api/meal-plans/:id/entries/:entryId
 * - PATCH: update servings, mealType, or dayOfWeek of an existing entry
 * - DELETE: remove an entry from the meal plan
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { verifyToken } from "@/lib/auth";

function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

// PATCH - update entry
export async function PATCH(req: NextRequest, { params }: { params: { id: string, entryId: string } }) {
  try {
    await connectToDatabase();

    const token = getTokenFromHeader(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id, entryId } = params;
    const { servings, mealType, dayOfWeek } = await req.json();

    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    const entry = mealPlan.entries.id(entryId);
    if (!entry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    if (servings !== undefined) entry.servings = servings;
    if (mealType) entry.mealType = mealType;
    if (dayOfWeek) entry.dayOfWeek = dayOfWeek;

    await mealPlan.save();

    return NextResponse.json({ entry }, { status: 200 });
  } catch (err) {
    console.error("PATCH /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

// DELETE - remove entry
export async function DELETE(req: NextRequest, { params }: { params: { id: string, entryId: string } }) {
  try {
    await connectToDatabase();

    const token = getTokenFromHeader(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id, entryId } = params;
    const mealPlan = await MealPlan.findOne({ _id: id, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    const entry = mealPlan.entries.id(entryId);
    if (!entry) return NextResponse.json({ message: "Entry not found" }, { status: 404 });

    entry.remove();
    await mealPlan.save();

    return NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /meal-plans/:id/entries/:entryId error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

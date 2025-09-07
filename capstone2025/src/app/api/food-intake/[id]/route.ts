// path: src/app/api/food-intake/[id]/route.ts
/**
 * Individual Food Intake endpoints
 * - GET: fetch a single food intake log
 * - PUT: update a food intake log
 * - DELETE: delete a food intake log
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import FoodIntake from "@/models/FoodIntake";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid food intake ID" }, { status: 400 });

    const foodIntake = await FoodIntake.findOne({ _id: id, userId });
    if (!foodIntake) return NextResponse.json({ message: "Food intake not found" }, { status: 404 });

    return NextResponse.json({ data: foodIntake });
  } catch (err) {
    console.error("Fetching food intake error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid food intake ID" }, { status: 400 });

    const body = await req.json();
    const { recipeId, ingredientId, date, quantity, unit, nutritionSnapshot } = body;

    if (!date || !quantity || !unit || (!recipeId && !ingredientId)) {
      return NextResponse.json({ message: "date, quantity, unit, and either recipeId or ingredientId required" }, { status: 400 });
    }

    const foodIntake = await FoodIntake.findOne({ _id: id, userId });
    if (!foodIntake) return NextResponse.json({ message: "Food intake not found" }, { status: 404 });

    foodIntake.recipeId = recipeId;
    foodIntake.ingredientId = ingredientId;
    foodIntake.date = date;
    foodIntake.quantity = quantity;
    foodIntake.unit = unit;
    foodIntake.nutritionSnapshot = nutritionSnapshot || {};

    await foodIntake.save();
    return NextResponse.json({ data: foodIntake });
  } catch (err) {
    console.error("Updating food intake error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Authorization required" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid food intake ID" }, { status: 400 });

    const foodIntake = await FoodIntake.findOneAndDelete({ _id: id, userId });
    if (!foodIntake) return NextResponse.json({ message: "Food intake not found" }, { status: 404 });

    return NextResponse.json({ message: "Food intake deleted successfully" });
  } catch (err) {
    console.error("Deleting food intake error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

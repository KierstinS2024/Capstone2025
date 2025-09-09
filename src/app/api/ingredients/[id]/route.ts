// path: src/app/api/ingredients/[id]/route.ts
/**
 * Single Ingredient endpoints
 * - GET: fetch ingredient by ID
 * - PUT: update ingredient
 * - DELETE: delete ingredient
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
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
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ingredient ID" }, { status: 400 });

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });

    return NextResponse.json({ data: ingredient });
  } catch (err) {
    console.error("Fetching ingredient error:", err);
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
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ingredient ID" }, { status: 400 });

    const body = await req.json();
    const { name, unit, defaultQuantity, nutritionInfo } = body;

    if (!name || !unit || !defaultQuantity) {
      return NextResponse.json({ message: "name, unit, and defaultQuantity are required" }, { status: 400 });
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { name, unit, defaultQuantity, nutritionInfo: nutritionInfo || {} },
      { new: true }
    );

    if (!ingredient) return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });

    return NextResponse.json({ data: ingredient });
  } catch (err) {
    console.error("Updating ingredient error:", err);
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
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ingredient ID" }, { status: 400 });

    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient) return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });

    return NextResponse.json({ message: "Ingredient deleted successfully" });
  } catch (err) {
    console.error("Deleting ingredient error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

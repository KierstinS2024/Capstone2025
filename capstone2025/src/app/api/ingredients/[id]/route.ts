// Path: src/app/api/ingredients/[id]/route.ts
"use server";

/**
 * Ingredient Single API
 * --------------------
 * GET → Retrieve a single ingredient by ID
 * PUT → Update ingredient (JWT required)
 * DELETE → Delete ingredient (JWT required)
 * Features:
 * - Lean queries
 * - Zod validation for PUT
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import mongoose from "mongoose";

// Zod schema for PUT
const updateIngredientSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  defaultQuantity: z.number().positive(),
  nutritionInfo: z.record(z.any()).optional(),
});

/**
 * GET /api/ingredients/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    requireAuth(req);
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const ingredient = await Ingredient.findById(id).lean();
    if (!ingredient)
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: ingredient });
  } catch (err) {
    console.error("GET /api/ingredients/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to fetch ingredient",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ingredients/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const body = await req.json();
    const parsed = updateIngredientSchema.parse(body);

    const updated = await Ingredient.findByIdAndUpdate(id, parsed, {
      new: true,
    }).lean();
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PUT /api/ingredients/[id] error:", err);
    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to update ingredient",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ingredients/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const deleted = await Ingredient.findByIdAndDelete(id).lean();
    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, message: "Ingredient deleted" });
  } catch (err) {
    console.error("DELETE /api/ingredients/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to delete ingredient",
      },
      { status: 500 }
    );
  }
}

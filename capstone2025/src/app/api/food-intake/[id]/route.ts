// Path: src/app/api/food-intake/[id]/route.ts
"use server";

/**
 * Food Intake Single API
 * ----------------------
 * GET    → Retrieve a single food intake entry by ID
 * PUT    → Update a food intake entry (JWT required)
 * DELETE → Delete a food intake entry (JWT required)
 * Features:
 * - Lean query for GET
 * - Zod validation for PUT
 * - Cookie-based JWT auth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import FoodIntake from "@/models/FoodIntake";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import mongoose from "mongoose";
import { foodIntakeFormSchema } from "@/schemas/food-intake/foodIntakeForm";

/**
 * GET /api/food-intake/[id]
 * - Returns a single food intake entry for current user
 * - Lean query for performance
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid food intake ID" },
        { status: 400 }
      );
    }

    const entry = await FoodIntake.findOne({ _id: id, userId }).lean();
    if (!entry)
      return NextResponse.json(
        { success: false, message: "Food intake entry not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error("GET /api/food-intake/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch food intake entry",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/food-intake/[id]
 * - Updates a food intake entry for current user
 * - Validates input with Zod
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid food intake ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = foodIntakeFormSchema.parse(body);

    const updatedEntry = await FoodIntake.findOneAndUpdate(
      { _id: id, userId },
      parsed,
      { new: true }
    );

    if (!updatedEntry)
      return NextResponse.json(
        { success: false, message: "Food intake entry not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedEntry });
  } catch (err) {
    console.error("PUT /api/food-intake/[id] error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to update food intake entry",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/food-intake/[id]
 * - Deletes a food intake entry for current user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid food intake ID" },
        { status: 400 }
      );
    }

    const deletedEntry = await FoodIntake.findOneAndDelete({ _id: id, userId });
    if (!deletedEntry)
      return NextResponse.json(
        { success: false, message: "Food intake entry not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Food intake entry deleted",
    });
  } catch (err) {
    console.error("DELETE /api/food-intake/[id] error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to delete food intake entry",
      },
      { status: 500 }
    );
  }
}

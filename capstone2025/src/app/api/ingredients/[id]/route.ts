/**
 * Ingredient Individual API
 * - GET: Fetch ingredient by ID (JWT-protected)
 * - PUT: Update ingredient by ID (JWT-protected)
 * - DELETE: Delete ingredient by ID (JWT-protected)
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { requireAuth } from "@/lib/authHelpers";
import { IngredientBody, ApiResponse } from "@/types/ingredient"; // updated import

// GET /api/ingredients/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ingredient ID" },
        { status: 400 }
      );
    }

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof ingredient>>({
      success: true,
      data: ingredient,
    });
  } catch (err) {
    console.error("Fetching ingredient error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/ingredients/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ingredient ID" },
        { status: 400 }
      );
    }

    const body: IngredientBody = await req.json();
    if (!body.name || !body.unit || body.defaultQuantity === undefined) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          message: "name, unit, and defaultQuantity are required",
        },
        { status: 400 }
      );
    }

    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { ...body, nutritionInfo: body.nutritionInfo || {} },
      { new: true }
    );

    if (!ingredient) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof ingredient>>({
      success: true,
      data: ingredient,
      message: "Ingredient updated successfully",
    });
  } catch (err) {
    console.error("Updating ingredient error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/ingredients/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ingredient ID" },
        { status: 400 }
      );
    }

    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Ingredient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Ingredient deleted successfully",
    });
  } catch (err) {
    console.error("Deleting ingredient error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// path: src/app/api/shopping-lists/[id]/items/[itemId]/route.ts
/**
 * Shopping List Item Operations
 * -----------------------------
 * PUT    /shopping-lists/:id/items/:itemId → Update item
 * DELETE /shopping-lists/:id/items/:itemId → Delete item
 *
 * JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

await connectToDatabase();

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// -----------------------------
// Helper: Get userId
// -----------------------------
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}

// PUT /shopping-lists/:id/items/:itemId
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const {
      quantity,
      unit,
      purchased,
    }: { quantity?: number; unit?: string; purchased?: boolean } =
      await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(params.id) ||
      !mongoose.Types.ObjectId.isValid(params.itemId)
    )
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ID(s)" },
        { status: 400 }
      );

    const list = await ShoppingList.findOne({ _id: params.id, userId });
    if (!list)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    const item = list.items.id(params.itemId);
    if (!item)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (purchased !== undefined) item.purchased = purchased;

    await list.save();
    return NextResponse.json<ApiResponse<typeof item>>({
      success: true,
      message: "Item updated",
      data: item,
    });
  } catch (err) {
    console.error("PUT /shopping-lists/:id/items/:itemId error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// DELETE /shopping-lists/:id/items/:itemId
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    if (
      !mongoose.Types.ObjectId.isValid(params.id) ||
      !mongoose.Types.ObjectId.isValid(params.itemId)
    )
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ID(s)" },
        { status: 400 }
      );

    const list = await ShoppingList.findOne({ _id: params.id, userId });
    if (!list)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    const item = list.items.id(params.itemId);
    if (!item)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    item.remove();
    await list.save();

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      message: "Item deleted",
      data: { id: params.itemId },
    });
  } catch (err) {
    console.error("DELETE /shopping-lists/:id/items/:itemId error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

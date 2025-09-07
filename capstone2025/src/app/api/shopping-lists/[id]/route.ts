// path: src/app/api/shopping-lists/[id]/route.ts
/**
 * Shopping List by ID API
 * ----------------------
 * GET    /shopping-lists/:id → Fetch a single shopping list
 * PUT    /shopping-lists/:id → Update shopping list
 * DELETE /shopping-lists/:id → Delete shopping list
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

// -----------------------------
// GET /shopping-lists/:id
// -----------------------------
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    if (!mongoose.Types.ObjectId.isValid(params.id))
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const list = await ShoppingList.findOne({ _id: params.id, userId });
    if (!list)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse<typeof list>>({
      success: true,
      data: list,
    });
  } catch (err) {
    console.error("GET /shopping-lists/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// -----------------------------
// PUT /shopping-lists/:id
// -----------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();

    const updatedList = await ShoppingList.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: body },
      { new: true }
    );
    if (!updatedList)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Shopping list not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse<typeof updatedList>>({
      success: true,
      message: "Shopping list updated",
      data: updatedList,
    });
  } catch (err) {
    console.error("PUT /shopping-lists/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE /shopping-lists/:id
// -----------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const deleted = await ShoppingList.findOneAndDelete({
      _id: params.id,
      userId,
    });
    if (!deleted)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Shopping list not found or unauthorized" },
        { status: 404 }
      );

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: "Shopping list deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /shopping-lists/:id error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

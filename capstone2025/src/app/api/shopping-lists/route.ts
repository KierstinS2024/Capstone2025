// path: src/app/api/shopping-lists/route.ts
/**
 * Shopping List API
 * -----------------
 * Handles:
 * - GET /shopping-lists → list all user's shopping lists
 * - POST /shopping-lists → create a new shopping list
 *
 * JWT-protected via Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

await connectToDatabase();

// -----------------------------
// Type Definitions
// -----------------------------
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ShoppingListItem {
  ingredientId: string;
  name?: string;
  quantity: number;
  unit: string;
  purchased?: boolean;
}

interface ShoppingListCreateBody {
  title: string;
  items?: ShoppingListItem[];
}

// -----------------------------
// Helper: Get userId from request
// -----------------------------
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}

// -----------------------------
// GET /shopping-lists
// -----------------------------
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const lists = await ShoppingList.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json<ApiResponse<typeof lists>>({
      success: true,
      data: lists,
    });
  } catch (err) {
    console.error("GET /shopping-lists error:", err);
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
// POST /shopping-lists
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const body: ShoppingListCreateBody = await req.json();
    if (!body.title)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Title is required" },
        { status: 400 }
      );

    const newList = await ShoppingList.create({
      userId,
      title: body.title,
      items: body.items || [],
    });

    return NextResponse.json<ApiResponse<typeof newList>>(
      { success: true, message: "Shopping list created", data: newList },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /shopping-lists error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// path: src/app/api/shopping-lists/[id]/items/route.ts
/**
 * POST /api/shopping-lists/:id/items
 * Add a new item to an existing shopping list
 * Body should include:
 *   - ingredientId: string
 *   - quantity: number
 *   - unit: string
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

function getToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { ingredientId, quantity, unit } = await req.json();
    if (!ingredientId || !quantity || !unit) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const list = await ShoppingList.findOne({ _id: params.id, userId });
    if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });

    const newItem = { ingredientId, quantity, unit, purchased: false };
    list.items.push(newItem);
    await list.save();

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (err) {
    console.error("POST /shopping-lists/:id/items error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

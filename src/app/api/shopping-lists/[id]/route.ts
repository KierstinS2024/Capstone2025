// path: src/app/api/shopping-lists/[id]/route.ts
/**
 * Shopping List by ID API
 * GET    /api/shopping-lists/:id → Fetch a single shopping list
 * PUT    /api/shopping-lists/:id → Update shopping list
 * DELETE /api/shopping-lists/:id → Delete shopping list
 * JWT-protected via requireAuth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const shoppingList = await ShoppingList.findOne({ _id: params.id, userId });
    if (!shoppingList) {
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: shoppingList });
  } catch (err) {
    console.error("GET shopping list error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const body = await req.json();
    const updatedList = await ShoppingList.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: body },
      { new: true }
    );

    if (!updatedList) {
      return NextResponse.json(
        { message: "Shopping list not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedList });
  } catch (err) {
    console.error("PUT shopping list error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const deleted = await ShoppingList.findOneAndDelete({ _id: params.id, userId });
    if (!deleted) {
      return NextResponse.json({ message: "Shopping list not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Shopping list deleted successfully" });
  } catch (err) {
    console.error("DELETE shopping list error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

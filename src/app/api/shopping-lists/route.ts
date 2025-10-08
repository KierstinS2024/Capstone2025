// ===========================================
// PATH: src/app/api/shopping-lists/route.ts
// ===========================================
// Collection-level Shopping List API
// -------------------------------------------
// - GET: fetch the authenticated user's shopping list
// - POST: add a single item OR multiple items
// - DELETE: clear all items in the shopping list
// - Requires authenticated user (via getUserFromRequest)
// - One shopping list per user (created if missing)
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import {
  getShoppingList,
  addShoppingListItem,
  addBulkShoppingListItems,
  clearShoppingList,
} from "@/lib/db";
import { getUserFromRequest } from "@/lib/serverAuth";

// -----------------------------
// GET /api/shopping-lists
// -----------------------------
// Returns the user's shopping list (creates one if it doesn’t exist)
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await getShoppingList(user.email);
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// POST /api/shopping-lists
// -----------------------------
// Accepts body: { name: string } OR { items: string[] }
// - If "name" is provided → add a single item
// - If "items" is provided → add multiple items
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.name) {
      // Add a single item
      const updatedList = await addShoppingListItem(user.email, body.name);
      return NextResponse.json(updatedList);
    }

    if (Array.isArray(body.items) && body.items.length > 0) {
      // Add multiple items at once
      const updatedList = await addBulkShoppingListItems(
        user.email,
        body.items
      );
      return NextResponse.json(updatedList);
    }

    return NextResponse.json(
      { error: "Missing name or items in request body" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// DELETE /api/shopping-lists
// -----------------------------
// Clears the user's shopping list (all items removed)
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedList = await clearShoppingList(user.email);
    return NextResponse.json(updatedList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ===========================================
// PATH: src/app/api/shopping-lists/[id]/route.ts
// ===========================================
// Item-level Shopping List API
// -------------------------------------------
// - PATCH: toggle a single item's checked status
// - DELETE: remove a single item from the list
// - Requires authenticated user (via getUserFromRequest)
// - Uses await params (Next.js 15+ App Router requirement)
// ===========================================

import { NextRequest, NextResponse } from "next/server";
import { toggleShoppingListItem, deleteShoppingListItem } from "@/lib/db";
import { getUserFromRequest } from "@/lib/serverAuth";

// -----------------------------
// PATCH /api/shopping-lists/:id
// -----------------------------
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params is async in App Router
) {
  // Authenticate user
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Await params before using
  const { id: itemId } = await context.params;
  if (!itemId) {
    return NextResponse.json({ error: "Missing item id" }, { status: 400 });
  }

  try {
    // Toggle the item's checked status
    const updatedList = await toggleShoppingListItem(user.email, itemId);
    return NextResponse.json(updatedList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -----------------------------
// DELETE /api/shopping-lists/:id
// -----------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 must await
) {
  // Authenticate user
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Await params before using
  const { id: itemId } = await context.params;
  if (!itemId) {
    return NextResponse.json({ error: "Missing item id" }, { status: 400 });
  }

  try {
    // Delete the item from the shopping list
    const updatedList = await deleteShoppingListItem(user.email, itemId);
    return NextResponse.json(updatedList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

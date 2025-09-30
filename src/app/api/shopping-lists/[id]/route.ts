import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingListModel, { IShoppingList } from "@/models/ShoppingList";
import mongoose from "mongoose";

// Helper: normalize list and items
function normalizeList(list: IShoppingList) {
  return {
    id: list.id.toString(),
    user: list.user.toString(),
    items: list.items.map((item) => ({
      id: item._id?.toString(),
      name: item.name,
      checked: item.checked,
    })),
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}

// GET /api/shopping-lists/[id]?user=<email>
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");

  if (!userEmail)
    return NextResponse.json({ error: "User email required" }, { status: 400 });

  await connectDB();

  const list = await ShoppingListModel.findById(id);
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(normalizeList(list));
}

// POST /api/shopping-lists/[id]?user=<email>  → add item
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");

  if (!userEmail)
    return NextResponse.json({ error: "User email required" }, { status: 400 });

  await connectDB();

  const list = await ShoppingListModel.findById(id);
  if (!list)
    return NextResponse.json({ error: "List not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  if (!body.name)
    return NextResponse.json({ error: "Item name required" }, { status: 400 });

  const newItem = {
    _id: new mongoose.Types.ObjectId(),
    name: body.name,
    checked: false,
  };
  list.items.push(newItem);
  await list.save();

  return NextResponse.json(
    {
      id: newItem._id.toString(),
      name: newItem.name,
      checked: newItem.checked,
    },
    { status: 201 }
  );
}

// POST /api/shopping-lists/[id]/toggle?itemId=<itemId>&user=<email>
export async function POST_TOGGLE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");
  const itemId = url.searchParams.get("itemId");

  if (!userEmail || !itemId)
    return NextResponse.json(
      { error: "User email and itemId required" },
      { status: 400 }
    );

  await connectDB();

  const list = await ShoppingListModel.findById(id);
  if (!list)
    return NextResponse.json({ error: "List not found" }, { status: 404 });

  const item = list.items.id(itemId);
  if (!item)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });

  item.checked = !item.checked;
  await list.save();

  return NextResponse.json({
    id: item._id.toString(),
    name: item.name,
    checked: item.checked,
  });
}

// DELETE /api/shopping-lists/[id]?itemId=<itemId>&user=<email>  → remove item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");
  const itemId = url.searchParams.get("itemId");

  if (!userEmail || !itemId)
    return NextResponse.json(
      { error: "User email and itemId required" },
      { status: 400 }
    );

  await connectDB();

  const list = await ShoppingListModel.findById(id);
  if (!list)
    return NextResponse.json({ error: "List not found" }, { status: 404 });

  list.items.id(itemId)?.remove();
  await list.save();

  return NextResponse.json({ success: true });
}

// POST /api/shopping-lists/[id]/clear?user=<email>  → clear all items
export async function POST_CLEAR(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");

  if (!userEmail)
    return NextResponse.json({ error: "User email required" }, { status: 400 });

  await connectDB();

  const list = await ShoppingListModel.findById(id);
  if (!list)
    return NextResponse.json({ error: "List not found" }, { status: 404 });

  list.items = [];
  await list.save();

  return NextResponse.json({ success: true });
}

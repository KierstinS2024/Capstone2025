// ===========================================
// PATH: src/app/api/shopping-lists/toggle/[id]/route.ts
// PUT toggle checked state of a shopping list item
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

interface Params {
  params: { id: string };
}

export async function PUT(_: Request, { params }: Params) {
  await connectDB();

  const list = await ShoppingList.findOne();
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  const item = list.items.id(params.id);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  item.checked = !item.checked;
  await list.save();

  return NextResponse.json(list);
}

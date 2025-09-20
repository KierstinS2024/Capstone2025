// ===========================================
// PATH: src/app/api/shopping-lists/remove/[id]/route.ts
// DELETE a single item from the shopping list
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

interface Params {
  params: { id: string };
}

export async function DELETE(_: Request, { params }: Params) {
  await connectDB();

  const list = await ShoppingList.findOne();
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  list.items = list.items.filter(
    (item: any) => item._id.toString() !== params.id
  );
  await list.save();

  return NextResponse.json(list);
}

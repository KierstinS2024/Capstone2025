// ===========================================
// PATH: src/app/api/shopping-lists/clear/route.ts
// DELETE all items in the shopping list
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

export async function DELETE() {
  await connectDB();

  let list = await ShoppingList.findOne();
  if (!list) {
    // create empty list if none exists
    list = await ShoppingList.create({ items: [] });
  } else {
    list.items = [];
    await list.save();
  }

  return NextResponse.json(list);
}

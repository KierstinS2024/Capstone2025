// ===========================================
// PATH: src/app/api/shopping-lists/add/route.ts
// POST a new item to the shopping list
// ===========================================

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

export async function POST(req: Request) {
  await connectDB();
  const { name } = await req.json();

  let list = await ShoppingList.findOne();
  if (!list) {
    list = await ShoppingList.create({ items: [] });
  }

  list.items.push({ name, checked: false });
  await list.save();

  return NextResponse.json(list);
}

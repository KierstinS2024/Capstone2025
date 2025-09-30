import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingListModel, { IShoppingList } from "@/models/ShoppingList";
import UserModel from "@/models/User";

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

// GET /api/shopping-lists?user=<email>
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");
  if (!userEmail)
    return NextResponse.json({ error: "User email required" }, { status: 400 });

  await connectDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const list = await ShoppingListModel.findOne({ user: user._id });
  if (!list)
    return NextResponse.json(
      { error: "Shopping list not found" },
      { status: 404 }
    );

  return NextResponse.json(normalizeList(list));
}

// POST /api/shopping-lists?user=<email>
// Creates a shopping list if it doesn't exist
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const userEmail = url.searchParams.get("user");
  if (!userEmail)
    return NextResponse.json({ error: "User email required" }, { status: 400 });

  await connectDB();

  const user = await UserModel.findOne({ email: userEmail });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  let existing = await ShoppingListModel.findOne({ user: user._id });
  if (existing)
    return NextResponse.json(
      { error: "Shopping list already exists" },
      { status: 409 }
    );

  const created = await ShoppingListModel.create({
    user: user._id,
    items: [],
  });

  return NextResponse.json(normalizeList(created), { status: 201 });
}

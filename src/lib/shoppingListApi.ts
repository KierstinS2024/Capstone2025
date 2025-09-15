// path: src/lib/shoppingListApi.ts
import { Types } from "mongoose";
import { connectDb } from "./db";
import ShoppingList, { IShoppingItem } from "@/models/ShoppingList";

// Fetch shopping list
export async function fetchShoppingList(
  userId: string
): Promise<{ items: IShoppingItem[] }> {
  await connectDb();
  const list = await ShoppingList.findOne({ userId });
  return list ? list.toObject() : { items: [] };
}

// Add single item
export async function addItemApi(
  userId: string,
  name: string,
  category = "other"
): Promise<IShoppingItem> {
  await connectDb();
  let list = await ShoppingList.findOne({ userId });

  const newItem: IShoppingItem = {
    name,
    category,
    purchased: false,
    mealTypes: [],
  };
  if (!list) list = new ShoppingList({ userId, items: [newItem] });
  else list.items.push(newItem);

  await list.save();
  return newItem;
}

// Remove item
export async function removeItemApi(userId: string, itemId: string) {
  await connectDb();
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("Shopping list not found");

  list.items = list.items.filter(
    (i: IShoppingItem & { _id?: Types.ObjectId }) =>
      i._id?.toString() !== itemId
  );
  await list.save();
  return list.toObject();
}

// Toggle purchased
export async function toggleItemApi(userId: string, itemId: string) {
  await connectDb();
  const list = await ShoppingList.findOne({ userId });
  if (!list) throw new Error("Shopping list not found");

  const item = list.items.find(
    (i: IShoppingItem & { _id?: Types.ObjectId }) =>
      i._id?.toString() === itemId
  );
  if (!item) throw new Error("Item not found");

  item.purchased = !item.purchased;
  await list.save();
  return item.toObject();
}

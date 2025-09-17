// ===========================================
// src/models/ShoppingList.ts
// ===========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IShoppingList extends Document {
  items: { name: string; checked: boolean }[];
}

const ShoppingListSchema = new Schema<IShoppingList>({
  items: [{ name: String, checked: Boolean }],
});

export default mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);

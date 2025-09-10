// src/models/ShoppingList.ts
// Mongoose schema and model for shopping lists

import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from "./User";

export type ShoppingCategory =
  | "produce"
  | "meat"
  | "dairy"
  | "frozen"
  | "other";

export interface IShoppingItem {
  ingredient: string;
  quantity: string;
  category: ShoppingCategory;
  checked: boolean;
}

export interface IShoppingList extends Document {
  userId: Types.ObjectId | IUser;
  title: string;
  items: IShoppingItem[];
}

const shoppingListSchema = new Schema<IShoppingList>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  items: [
    {
      ingredient: { type: String, required: true },
      quantity: { type: String, required: true },
      category: {
        type: String,
        enum: ["produce", "meat", "dairy", "frozen", "other"],
        required: true,
      },
      checked: { type: Boolean, default: false },
    },
  ],
});

export const ShoppingList =
  mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", shoppingListSchema);

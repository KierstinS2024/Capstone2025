// src/models/ShoppingList.ts
import { Schema, model, models, Document, Types } from "mongoose";

// Shopping item subdocument
export interface IShoppingItem {
  name: string;
  quantity?: string;
  category?: string;
  mealTypes?: ("breakfast" | "lunch" | "dinner")[];
  purchased: boolean;
}

// Shopping list document interface
export interface IShoppingList extends Document {
  userId: Types.ObjectId;
  date?: string; // optional
  items: IShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingItemSchema = new Schema<IShoppingItem>(
  {
    name: { type: String, required: true },
    quantity: { type: String },
    category: { type: String },
    mealTypes: {
      type: [String],
      enum: ["breakfast", "lunch", "dinner"],
      default: [],
    },
    purchased: { type: Boolean, default: false },
  },
  { _id: false }
);

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String },
    items: { type: [ShoppingItemSchema], default: [] },
  },
  { timestamps: true }
);

const ShoppingList =
  models.ShoppingList ||
  model<IShoppingList>("ShoppingList", ShoppingListSchema);
export default ShoppingList;

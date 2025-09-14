// path: src/models/ShoppingList.ts
import { Schema, model, models, type Document } from "mongoose";

// Define valid meal types
export type MealType = "breakfast" | "lunch" | "dinner";

// Shopping item subdocument
export interface IShoppingItem {
  name: string;
  quantity: string;
  category?: string;
  mealTypes: MealType[];
  purchased: boolean;
}

// Shopping list document interface
export interface IShoppingList extends Document {
  userId: string;
  date?: string; // optional ISO date string
  items: IShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ShoppingItem schema
const ShoppingItemSchema = new Schema<IShoppingItem>(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
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

// ShoppingList schema
const ShoppingListSchema = new Schema<IShoppingList>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String }, // optional
    items: { type: [ShoppingItemSchema], default: [] },
  },
  { timestamps: true }
);

export const ShoppingList =
  models.ShoppingList ||
  model<IShoppingList>("ShoppingList", ShoppingListSchema);

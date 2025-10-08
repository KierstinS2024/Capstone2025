// ===========================================
// PATH: src/models/ShoppingList.ts
// MongoDB Shopping List Model (Mongoose)
// Each user has exactly one list, scoped by email
// ===========================================

import mongoose, { Schema, Document } from "mongoose";

// -------------------------------------------
// Interfaces
// -------------------------------------------

// Single item inside the shopping list
export interface IShoppingListItem {
  _id?: mongoose.Types.ObjectId;
  name: string;
  checked: boolean;
}

// Full shopping list document
export interface IShoppingList extends Document {
  ownerEmail: string; // user's email
  items: IShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

// -------------------------------------------
// Schema Definition
// -------------------------------------------

const ShoppingListItemSchema = new Schema<IShoppingListItem>(
  {
    name: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },
  },
  { _id: true } // each item gets its own ObjectId
);

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    ownerEmail: { type: String, required: true, unique: true },
    items: [ShoppingListItemSchema],
  },
  { timestamps: true }
);

// -------------------------------------------
// Export (avoid recompiling model on hot reload)
// -------------------------------------------
export default mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);

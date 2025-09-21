// ===========================================
// PATH: src/models/ShoppingList.ts
// MongoDB Shopping List Model (Mongoose)
// Each user has exactly one list, scoped by user ID
// ===========================================

import mongoose, { Schema, Document, Types } from "mongoose";

// -------------------------------------------
// Interfaces
// -------------------------------------------

// Single item inside the shopping list
export interface IShoppingListItem {
  _id?: Types.ObjectId;
  name: string;
  checked: boolean;
}

// Full shopping list document
export interface IShoppingList extends Document {
  user: Types.ObjectId; // reference to User who owns this list
  items: IShoppingListItem[]; // array of shopping list items
  createdAt: Date; // auto from timestamps
  updatedAt: Date; // auto from timestamps
}

// -------------------------------------------
// Schema Definition
// -------------------------------------------

const ShoppingListItemSchema = new Schema<IShoppingListItem>(
  {
    name: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },
  },
  { _id: true } // each item gets its own ObjectId (so toggle/remove work)
);

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one list per user
    },
    items: [ShoppingListItemSchema],
  },
  { timestamps: true } // adds createdAt + updatedAt
);

// -------------------------------------------
// Export (avoid recompiling model on hot reload)
// -------------------------------------------
export default mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);

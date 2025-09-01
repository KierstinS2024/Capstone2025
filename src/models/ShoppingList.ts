// src/models/ShoppingList.ts
import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Each item in a shopping list
export interface ShoppingListItem {
  _id: Types.ObjectId; // Mongoose automatically adds this to subdocuments
  ingredientId: Types.ObjectId;
  quantity?: number;
  unit?: string;
  purchased: boolean;
}

// The shopping list document interface
export interface IShoppingList extends Document {
  userId: Types.ObjectId;
  mealPlanId?: Types.ObjectId;
  createdAt: Date;
  items: ShoppingListItem[];
}

const ShoppingListSchema: Schema<IShoppingList> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  mealPlanId: { type: Schema.Types.ObjectId, ref: "MealPlan" },
  createdAt: { type: Date, default: Date.now },
  items: [
    {
      ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: { type: Number },
      unit: { type: String },
      purchased: { type: Boolean, default: false },
    },
  ],
});

// Use existing model if exists, else create a new one
const ShoppingList: Model<IShoppingList> =
  mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);

export default ShoppingList;

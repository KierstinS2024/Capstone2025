// path: src/models/ShoppingList.ts
/**
 * ShoppingList model
 * Represents a grocery/shopping list generated from a meal plan or manual entry
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IShoppingList extends Document {
  userId: mongoose.Types.ObjectId;
  mealPlanId?: mongoose.Types.ObjectId;
  title: string;
  items: {
    ingredientId: mongoose.Types.ObjectId;
    quantity: number;
    unit: string;
    purchased: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingListSchema = new Schema<IShoppingList>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mealPlanId: { type: Schema.Types.ObjectId, ref: "MealPlan" },
    title: { type: String, required: true },
    items: [
      {
        ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        purchased: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ShoppingList || mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);

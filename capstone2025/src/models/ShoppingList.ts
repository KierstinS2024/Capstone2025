// path: src/models/ShoppingList.ts
/**
 * ShoppingList model
 * Represents a grocery/shopping list generated from a meal plan or manual entry
 */
import mongoose, { Schema, Document } from "mongoose";

export interface ShoppingListDocument extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  mealPlanId?: mongoose.Types.ObjectId; // Optional meal plan reference
  title: string; // Name of the shopping list
  items: {
    ingredientId: mongoose.Types.ObjectId; // Ingredient in the list
    quantity: number; // Amount needed
    unit: string; // Unit of measurement
    purchased: boolean; // Checked off?
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingListSchema = new Schema<ShoppingListDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mealPlanId: { type: Schema.Types.ObjectId, ref: "MealPlan" },
    title: { type: String, required: true },
    items: [
      {
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        purchased: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.ShoppingList ||
  mongoose.model<ShoppingListDocument>("ShoppingList", ShoppingListSchema);

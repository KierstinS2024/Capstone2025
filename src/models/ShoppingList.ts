// src/models/ShoppingList.ts
import mongoose from "mongoose";

// Each shopping list belongs to a user and may reference a meal plan
const ShoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "MealPlan" },
  createdAt: { type: Date, default: Date.now },
  items: [
    {
      ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
      quantity: Number,
      unit: String,
      purchased: { type: Boolean, default: false },
    },
  ],
});

// Export the model
export default mongoose.models.ShoppingList || mongoose.model("ShoppingList", ShoppingListSchema);

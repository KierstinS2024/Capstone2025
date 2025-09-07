// File: src/models/ShoppingList.ts
// Purpose: Mongoose model for shopping lists
// Represents grocery lists generated from meal plans or manual entries

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface for individual items in a shopping list
 */
interface ShoppingListItem {
  ingredientId: mongoose.Types.ObjectId; // Reference to an ingredient
  quantity: number;                      // Amount required
  unit: string;                          // Measurement unit (e.g., g, cup)
  purchased: boolean;                    // Whether the item has been checked off
}

/**
 * TypeScript interface representing a ShoppingList document
 */
export interface ShoppingListDocument extends Document {
  userId: mongoose.Types.ObjectId;         // Owner of the list
  mealPlanId?: mongoose.Types.ObjectId;    // Optional reference to a meal plan
  title: string;                           // Name of the shopping list
  items: ShoppingListItem[];               // Array of items
  createdAt: Date;                         // Auto-generated timestamp
  updatedAt: Date;                         // Auto-updated timestamp
}

/**
 * Mongoose schema for the shopping list
 */
const ShoppingListSchema = new Schema<ShoppingListDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User reference is required"] 
    },
    mealPlanId: { 
      type: Schema.Types.ObjectId, 
      ref: "MealPlan", 
      default: null // Optional reference to a meal plan
    },
    title: { 
      type: String, 
      required: [true, "Title is required"], 
      trim: true 
    },
    items: [
      {
        ingredientId: { 
          type: Schema.Types.ObjectId, 
          ref: "Ingredient", 
          required: [true, "Ingredient reference is required"] 
        },
        quantity: { 
          type: Number, 
          required: [true, "Quantity is required"], 
          min: [0, "Quantity cannot be negative"] 
        },

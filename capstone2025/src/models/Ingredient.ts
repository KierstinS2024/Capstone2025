// File: src/models/Ingredient.ts
// Purpose: Represents an ingredient used in recipes and shopping lists

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface representing an Ingredient document
 */
export interface IngredientDocument extends Document {
  name: string; // Name of the ingredient (e.g., "Tomato")
  unit: string; // Default unit (e.g., "g", "cup")
  defaultQuantity: number; // Default quantity per unit
  nutritionInfo?: Record<string, any>; // Optional nutrition info (calories, macros)
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

/**
 * Mongoose schema defining the Ingredient structure
 */
const IngredientSchema = new Schema<IngredientDocument>(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    defaultQuantity: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Default quantity must be non-negative"],
    },
    nutritionInfo: {
      type: Schema.Types.Mixed,
      default: {}, // Can store calories, protein, fat, carbs, etc.
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

/**
 * Export the model
 * Prevents model overwrite errors during hot reload
 */
export default mongoose.models.Ingredient ||
  mongoose.model<IngredientDocument>("Ingredient", IngredientSchema);

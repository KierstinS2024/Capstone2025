// File: src/models/Recipe.ts
// Purpose: Stores recipe details, ingredients, instructions, and optional nutrition info.

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface for individual recipe ingredients
 */
interface RecipeIngredient {
  ingredientId: mongoose.Types.ObjectId; // Reference to an Ingredient
  quantity: number; // Amount required
  unit: string; // Measurement unit (e.g., g, cup)
}

/**
 * TypeScript interface representing a Recipe document
 */
export interface RecipeDocument extends Document {
  name: string; // Recipe title
  description: string; // Recipe description or summary
  instructions: string[]; // Step-by-step instructions
  cuisine?: string; // Optional cuisine type
  userSubmitted: boolean; // True if user submitted
  createdByUserId?: mongoose.Types.ObjectId; // Reference to submitting user (if any)
  ingredients: RecipeIngredient[]; // Array of recipe ingredients
  nutritionInfo?: Record<string, any>; // Optional nutrition info (calories, macros)
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-updated timestamp
}

/**
 * Mongoose schema defining Recipe structure
 */
const RecipeSchema = new Schema<RecipeDocument>(
  {
    name: {
      type: String,
      required: [true, "Recipe name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    instructions: {
      type: [String],
      default: [],
    },
    cuisine: {
      type: String,
      trim: true,
    },
    userSubmitted: {
      type: Boolean,
      default: false,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ingredients: [
      {
        ingredientId: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
          required: [true, "Ingredient reference is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [0, "Quantity cannot be negative"],
        },
        unit: {
          type: String,
          required: [true, "Unit is required"],
          trim: true,
        },
      },
    ],
    nutritionInfo: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

/**
 * Export Mongoose model
 * Prevents model overwrite errors during hot reload
 */
export default mongoose.models.Recipe ||
  mongoose.model<RecipeDocument>("Recipe", RecipeSchema);

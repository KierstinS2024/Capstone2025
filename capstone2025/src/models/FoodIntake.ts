// File: src/models/FoodIntake.ts
// Purpose: Logs what a user consumes for nutrition tracking (recipes or individual ingredients)

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface representing a Food Intake document
 */
export interface FoodIntakeDocument extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  recipeId?: mongoose.Types.ObjectId; // Optional reference to a recipe
  ingredientId?: mongoose.Types.ObjectId; // Optional reference to a single ingredient
  date: Date; // Date of consumption
  quantity: number; // Amount consumed
  unit: string; // Unit of measurement (e.g., g, cup)
  nutritionSnapshot?: Record<string, any>; // Captures nutrition info at logging time
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

/**
 * Mongoose schema defining the structure of FoodIntake
 */
const FoodIntakeSchema = new Schema<FoodIntakeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient",
    },
    date: {
      type: Date,
      required: [true, "Consumption date is required"],
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be non-negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    nutritionSnapshot: {
      type: Schema.Types.Mixed,
      default: {}, // Store calories, macros, or other nutrition info
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

/**
 * Export the model
 * Ensures compatibility with hot-reload in development
 */
export default mongoose.models.FoodIntake ||
  mongoose.model<FoodIntakeDocument>("FoodIntake", FoodIntakeSchema);

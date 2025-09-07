// File: src/models/MealPlan.ts
// Purpose: Stores a user's weekly meal plan with entries for each day and meal
// Supports drag-and-drop ordering for Kanban-style views

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface for an individual meal plan entry
 */
export interface MealPlanEntry {
  recipeId: mongoose.Types.ObjectId; // Reference to a Recipe
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  servings: number; // Number of servings
  order?: number; // Optional ordering for drag-and-drop UI
}

/**
 * TypeScript interface representing a MealPlan document
 */
export interface MealPlanDocument extends Document {
  userId: mongoose.Types.ObjectId; // Owner of the meal plan
  weekStartDate: Date; // Start date of the plan week
  notes?: string; // Optional notes for the plan
  entries: MealPlanEntry[]; // Array of meals for the week
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

/**
 * Mongoose schema for MealPlan
 */
const MealPlanSchema = new Schema<MealPlanDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    weekStartDate: {
      type: Date,
      required: [true, "Week start date is required"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    entries: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: "Recipe",
          required: [true, "Recipe reference is required"],
        },
        dayOfWeek: {
          type: String,
          required: [true, "Day of week is required"],
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        mealType: {
          type: String,
          required: [true, "Meal type is required"],
          enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
        },
        servings: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Servings must be at least 1"],
        },
        order: {
          type: Number,
          default: 0, // For drag-and-drop ordering
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

/**
 * Unique index to ensure one plan per user per week
 */
MealPlanSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

/**
 * Export Mongoose model
 * Prevents OverwriteModelError in development
 */
export default mongoose.models.MealPlan ||
  mongoose.model<MealPlanDocument>("MealPlan", MealPlanSchema);

// path: src/models/MealPlan.ts
/**
 * MealPlan model
 * Stores a user's weekly meal plan with entries for each day and meal
 * Supports ordering of entries for drag-and-drop Kanban-style view
 */

import mongoose, { Schema, Document } from "mongoose";

export interface MealPlanEntry {
  recipeId: mongoose.Types.ObjectId; // Recipe assigned to a meal
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
  order?: number; // optional field for drag-and-drop ordering
}

export interface MealPlanDocument extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  weekStartDate: Date; // Start date of the plan
  notes?: string;
  entries: MealPlanEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema = new Schema<MealPlanDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStartDate: { type: Date, required: true },
    notes: { type: String, default: "" },
    entries: [
      {
        recipeId: {
          type: Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        },
        dayOfWeek: {
          type: String,
          required: true,
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
          required: true,
          enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
        },
        servings: { type: Number, required: true, default: 1, min: 1 },
        order: { type: Number, default: 0 }, // <-- added order
      },
    ],
  },
  { timestamps: true }
);

// Ensure one plan per user per week
MealPlanSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.models.MealPlan ||
  mongoose.model<MealPlanDocument>("MealPlan", MealPlanSchema);

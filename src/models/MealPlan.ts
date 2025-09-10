// src/models/MealPlan.ts
// Mongoose schema and model for meal plans

import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from "./User";
import type { IRecipe } from "./Recipe";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface IMealPlanEntry {
  date: Date;
  mealType: MealType;
  recipeId: Types.ObjectId | IRecipe;
}

export interface IMealPlan extends Document {
  userId: Types.ObjectId | IUser;
  title: string;
  startDate: Date;
  endDate: Date;
  entries: IMealPlanEntry[];
}

const mealPlanSchema = new Schema<IMealPlan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  entries: [
    {
      date: { type: Date, required: true },
      mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true,
      },
      recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    },
  ],
});

export const MealPlan =
  mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", mealPlanSchema);

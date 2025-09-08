// Path: src/models/FoodIntake.ts
// Purpose: Logs what a user consumes (recipes or ingredients) for nutrition tracking.
// Notes: Enforces one of recipeId or ingredientId, stores nutrition snapshot at logging time.

import mongoose, { Schema, Document } from "mongoose";

export interface NutritionSnapshot {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  [key: string]: number; // extensible (fiber, sugar, etc.)
}

export interface FoodIntakeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId?: mongoose.Types.ObjectId;
  ingredientId?: mongoose.Types.ObjectId;
  date: Date;
  quantity: number;
  unit: string;
  nutritionSnapshot?: NutritionSnapshot;
  createdAt: Date;
  updatedAt: Date;
}

const FoodIntakeSchema = new Schema<FoodIntakeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true, // helpful for lookups
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
      index: true, // support sorting by date
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
      default: {},
    },
  },
  { timestamps: true }
);

// Index compound for user/date queries
FoodIntakeSchema.index({ userId: 1, date: -1 });

// Enforce either recipeId or ingredientId
FoodIntakeSchema.pre("validate", function (next) {
  if (!this.recipeId && !this.ingredientId) {
    return next(new Error("Either recipeId or ingredientId is required"));
  }
  if (this.recipeId && this.ingredientId) {
    return next(new Error("Only one of recipeId or ingredientId can be set"));
  }
  next();
});

export default mongoose.models.FoodIntake ||
  mongoose.model<FoodIntakeDocument>("FoodIntake", FoodIntakeSchema);

// src/models/MealPlan.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// TypeScript interface for a meal plan entry
export interface MealPlanEntry {
  recipeId: mongoose.Types.ObjectId;
  dayOfWeek: string;   // 'Monday', 'Tuesday', etc.
  mealType: string;    // 'breakfast', 'lunch', 'dinner', 'snack'
  servings: number;
}

// TypeScript interface for the full MealPlan document
export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  weekStartDate?: Date;
  notes?: string;
  entries: MealPlanEntry[];
}

const MealPlanSchema: Schema<IMealPlan> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  weekStartDate: { type: Date },
  notes: { type: String },
  entries: [
    {
      recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
      dayOfWeek: { type: String, required: true },
      mealType: { type: String, required: true },
      servings: { type: Number, required: true }
    }
  ]
});

// Use existing model if it exists, otherwise create a new one
const MealPlan: Model<IMealPlan> =
  mongoose.models.MealPlan || mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

export default MealPlan;

// path: src/models/MealPlan.ts
/**
 * MealPlan model
 * Stores a user's weekly meal plan with entries for each day and meal
 */
import mongoose, { Schema, Document } from "mongoose";

export interface MealPlanDocument extends Document {
  userId: mongoose.Types.ObjectId;        // Reference to User
  weekStartDate: Date;                    // Monday of the week
  notes?: string;                         // Optional notes for the week
  entries: {
    recipeId: mongoose.Types.ObjectId;    // Recipe assigned to a meal
    dayOfWeek: string;                    // "Monday", "Tuesday", etc.
    mealType: string;                     // "Breakfast", "Lunch", "Dinner"
    servings: number;                     // Number of servings
  }[];
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
        recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
        dayOfWeek: { type: String, required: true },
        mealType: { type: String, required: true },
        servings: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.MealPlan || mongoose.model<MealPlanDocument>("MealPlan", MealPlanSchema);

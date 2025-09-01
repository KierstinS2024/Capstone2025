// path: src/models/MealPlan.ts
/**
 * MealPlan model
 * Stores a user's weekly meal plan with entries for each day and meal
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId; // references User
  weekStartDate: Date;
  notes?: string;
  entries: {
    recipeId: mongoose.Types.ObjectId;
    dayOfWeek: string; // e.g., "Monday"
    mealType: string; // e.g., "Breakfast", "Lunch", "Dinner"
    servings: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
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

export default mongoose.models.MealPlan || mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

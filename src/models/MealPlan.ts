// src/models/MealPlan.ts
import { Schema, model, models, Document, Types } from "mongoose";

// Meal document interface
export interface IMeal {
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  date: string; // ISO string YYYY-MM-DD
  recipeId?: Types.ObjectId;
  image?: string;
  ingredients?: { name: string; quantity?: string }[];
}

// MealPlan document interface
export interface IMealPlan extends Document {
  userId: Types.ObjectId;
  startDate: string;
  endDate: string;
  meals: IMeal[];
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    date: { type: String, required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
    image: { type: String },
    ingredients: { type: [{ name: String, quantity: String }], default: [] },
  },
  { _id: true }
);

const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    meals: { type: [MealSchema], default: [] },
  },
  { timestamps: true }
);

const MealPlan =
  models.MealPlan || model<IMealPlan>("MealPlan", MealPlanSchema);
export default MealPlan;

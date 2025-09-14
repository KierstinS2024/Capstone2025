// path: src/models/MealPlan.ts
import { Schema, model, models, type Document } from "mongoose";

// Define meal types
export type MealType = "breakfast" | "lunch" | "dinner";

// Meal subdocument schema
export interface IMeal {
  type: MealType;
  date: string; // ISO string
  name: string;
  recipeId?: string; // links to Recipe
  image?: string;
  source?: "spoonacular" | "custom";
  description?: string;
  notes?: string;
}

// MealPlan document interface
export interface IMealPlan extends Document {
  userId: string;
  startDate: string;
  endDate: string;
  meals: IMeal[];
  createdAt: Date;
  updatedAt: Date;
}

// Meal schema
const MealSchema = new Schema<IMeal>(
  {
    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    date: { type: String, required: true },
    name: { type: String, required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
    image: { type: String },
    source: { type: String, enum: ["spoonacular", "custom"] },
    description: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

// MealPlan schema
const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    meals: { type: [MealSchema], default: [] },
  },
  { timestamps: true }
);

export const MealPlan =
  models.MealPlan || model<IMealPlan>("MealPlan", MealPlanSchema);

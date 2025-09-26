// ===========================================
// PATH: src/models/MealPlan.ts
//
// Mongoose Model: MealPlan
// Stores a user's scheduled meals.
// Each MealPlan has a title, start/end dates, and a map of meals per day.
//
// Business Rule (current): Each user has at most one active plan.
// ===========================================

import mongoose, { Schema, Document } from "mongoose";

// -------------------------------------------
// TypeScript interface for Mongo documents
// -------------------------------------------
export interface IMealPlan extends Document {
  title: string; // Meal plan title
  startDate: string; // ISO string of the plan start date
  endDate: string; // ISO string of the plan end date
  meals: Record<
    string, // date string: YYYY-MM-DD
    {
      breakfast?: string | null; // recipe ID or null
      lunch?: string | null;
      dinner?: string | null;
    }
  >;
  user?: string; // optional owner ID (could be user ID/email)
  createdAt?: Date; // automatic timestamp
  updatedAt?: Date; // automatic timestamp
}

// -------------------------------------------
// Mongoose schema
// -------------------------------------------
const MealPlanSchema = new Schema<IMealPlan>(
  {
    title: { type: String, required: true },

    // Store dates as ISO strings for consistency with frontend
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    // Meals map: keyed by date string
    meals: {
      type: Map,
      of: new Schema(
        {
          breakfast: { type: String, default: null },
          lunch: { type: String, default: null },
          dinner: { type: String, default: null },
        },
        { _id: false } // prevent nested _id for each map value
      ),
      default: {}, // default to empty map
    },

    // Optional user ID to associate with the plan
    user: { type: String, required: true },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// -------------------------------------------
// Prevent model overwrite during hot reload
// (important for Next.js dev environment)
// -------------------------------------------
export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

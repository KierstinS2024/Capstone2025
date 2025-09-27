// ===========================================
// PATH: src/models/MealPlan.ts
//
// Mongoose Model: MealPlan
// -------------------------------------------
// Best-practice version that ensures:
// - Each MealPlan belongs to a single User
// - Each user can have at most ONE active plan
// - Dates stored as Date objects for real queries
// - Meals stored as normalized Map
// - createdAt / updatedAt tracked automatically
// ===========================================

import mongoose, { Schema, Document, Types } from "mongoose";

// -------------------------------------------
// TypeScript interface for MealPlan documents
// -------------------------------------------
export interface IMealPlan extends Document {
  title: string; // Human-friendly title
  startDate: Date; // stored as Date in DB
  endDate: Date; // stored as Date in DB
  meals: Record<
    string,
    {
      breakfast?: string | null;
      lunch?: string | null;
      dinner?: string | null;
    }
  >;
  user: Types.ObjectId; // Reference to User collection
  createdAt?: Date;
  updatedAt?: Date;
}

// -------------------------------------------
// Mongoose Schema definition
// -------------------------------------------
const MealPlanSchema = new Schema<IMealPlan>(
  {
    title: { type: String, required: true },

    // ✅ Dates stored as real Date objects
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // ✅ Meals: Map keyed by YYYY-MM-DD
    meals: {
      type: Map,
      of: new Schema(
        {
          breakfast: { type: String, default: null },
          lunch: { type: String, default: null },
          dinner: { type: String, default: null },
        },
        { _id: false }
      ),
      default: {},
    },

    // ✅ User reference
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // auto createdAt / updatedAt
  }
);

// -------------------------------------------
// Indexes
// -------------------------------------------

// Enforce "one plan per user"
MealPlanSchema.index({ user: 1 }, { unique: true });

// -------------------------------------------
// Prevent model overwrite during hot reload
// -------------------------------------------
export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

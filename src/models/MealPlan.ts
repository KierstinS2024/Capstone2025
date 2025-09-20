//src/models/MealPlan.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  title: string;
  startDate: string;
  endDate: string;
  meals: Record<
    string,
    {
      breakfast?: string | null;
      lunch?: string | null;
      dinner?: string | null;
    }
  >;
  user?: string; // optional: owner ID
  createdAt?: Date;
  updatedAt?: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
  {
    title: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    meals: {
      type: Map,
      of: new Schema({
        breakfast: { type: String, default: null },
        lunch: { type: String, default: null },
        dinner: { type: String, default: null },
      }),
      default: {},
    },
    user: { type: String }, // optional: can store userId/email
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

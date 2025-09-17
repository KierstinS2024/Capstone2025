import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  title: string;
  startDate: string;
  endDate: string;
  meals: Record<
    string,
    {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    }
  >;
}

const MealPlanSchema = new Schema<IMealPlan>({
  title: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  meals: {
    type: Map,
    of: new Schema({
      breakfast: String,
      lunch: String,
      dinner: String,
    }),
    default: {},
  },
});

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

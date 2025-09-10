import mongoose, { Schema, Document } from "mongoose";

export interface IMealEntry {
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId: mongoose.Types.ObjectId;
}

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startDate: Date;
  endDate: Date;
  entries: IMealEntry[];
}

const MealPlanSchema = new Schema<IMealPlan>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  entries: [
    {
      date: { type: Date, required: true },
      mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true,
      },
      recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
    },
  ],
});

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);

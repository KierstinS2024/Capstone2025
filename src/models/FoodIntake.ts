// path: src/models/FoodIntake.ts
/**
 * FoodIntake model
 * Logs user consumption of recipes or ingredients for nutrition tracking
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IFoodIntake extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId?: mongoose.Types.ObjectId;
  ingredientId?: mongoose.Types.ObjectId;
  date: Date;
  quantity: number;
  unit: string;
  nutritionSnapshot?: Record<string, any>; // snapshot of calories/macros at time of logging
  createdAt: Date;
  updatedAt: Date;
}

const FoodIntakeSchema = new Schema<IFoodIntake>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
    ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    nutritionSnapshot: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.FoodIntake || mongoose.model<IFoodIntake>("FoodIntake", FoodIntakeSchema);

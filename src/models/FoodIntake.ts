// path: src/models/FoodIntake.ts
/**
 * FoodIntake model
 * Logs what the user consumes for nutrition tracking
 */
import mongoose, { Schema, Document } from "mongoose";

export interface FoodIntakeDocument extends Document {
  userId: mongoose.Types.ObjectId;          // Reference to User
  recipeId?: mongoose.Types.ObjectId;       // Optional recipe reference
  ingredientId?: mongoose.Types.ObjectId;   // Optional ingredient reference
  date: Date;                               // Date of consumption
  quantity: number;                         // Amount consumed
  unit: string;                             // Unit of measurement
  nutritionSnapshot?: Record<string, any>;  // Calories/macros at time of logging
  createdAt: Date;
  updatedAt: Date;
}

const FoodIntakeSchema = new Schema<FoodIntakeDocument>(
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

export default mongoose.models.FoodIntake || mongoose.model<FoodIntakeDocument>("FoodIntake", FoodIntakeSchema);

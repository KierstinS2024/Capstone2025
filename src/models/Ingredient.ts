// path: src/models/Ingredient.ts
/**
 * Ingredient model
 * Represents an ingredient that can be used in recipes and shopping lists
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient extends Document {
  name: string;
  unit: string; // e.g., grams, cups
  defaultQuantity: number; // default quantity for recipes
  nutritionInfo?: Record<string, any>; // e.g., calories, macros
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    defaultQuantity: { type: Number, required: true, default: 1 },
    nutritionInfo: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Ingredient || mongoose.model<IIngredient>("Ingredient", IngredientSchema);

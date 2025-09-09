// path: src/models/Ingredient.ts
/**
 * Ingredient model
 * Represents an ingredient for recipes and shopping lists
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IngredientDocument extends Document {
  name: string;
  unit: string;
  defaultQuantity: number;
  nutritionInfo?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IngredientDocument>(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    defaultQuantity: { type: Number, required: true, default: 1 },
    nutritionInfo: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Ingredient || mongoose.model<IngredientDocument>("Ingredient", IngredientSchema);

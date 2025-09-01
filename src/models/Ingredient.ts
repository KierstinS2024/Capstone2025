// src/models/Ingredient.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// Define TypeScript interface for an ingredient document
export interface IIngredient extends Document {
  name: string;
  unit?: string; // grams, ml, pcs
  defaultQuantity?: number;
  nutritionInfo?: Record<string, any>;
}

const IngredientSchema: Schema<IIngredient> = new Schema({
  name: { type: String, required: true },
  unit: { type: String },
  defaultQuantity: { type: Number },
  nutritionInfo: { type: Object }
});

// Use existing model if it exists, otherwise create new one
const Ingredient: Model<IIngredient> =
  mongoose.models.Ingredient || mongoose.model<IIngredient>("Ingredient", IngredientSchema);

export default Ingredient;

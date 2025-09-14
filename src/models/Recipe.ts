// path: src/models/Recipe.ts
import { Schema, model, models, type Document } from "mongoose";

// Define possible recipe sources
export type RecipeSource = "local" | "spoonacular";

// Ingredient subdocument schema
export interface IRecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

// Recipe document interface
export interface IRecipe extends Document {
  userId: string; // owner of the recipe
  title: string;
  ingredients: IRecipeIngredient[];
  instructions: string;
  source: RecipeSource;
  spoonacularId?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Ingredient schema
const IngredientSchema = new Schema<IRecipeIngredient>(
  {
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String, required: true },
  },
  { _id: false } // no extra _id for subdocuments
);

// Recipe schema
const RecipeSchema = new Schema<IRecipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    ingredients: { type: [IngredientSchema], required: true },
    instructions: { type: String, required: true },
    source: { type: String, enum: ["local", "spoonacular"], required: true },
    spoonacularId: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

export const Recipe = models.Recipe || model<IRecipe>("Recipe", RecipeSchema);

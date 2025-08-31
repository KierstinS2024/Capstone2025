// src/models/Ingredient.ts

import mongoose from 'mongoose';

// This schema stores ingredients used in recipes or shopping lists
const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: String, // grams, ml, pcs
  defaultQuantity: Number,
  nutritionInfo: Object
});

export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);

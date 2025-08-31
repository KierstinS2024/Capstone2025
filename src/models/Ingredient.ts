// src/models/Ingredient.ts

import mongoose from 'mongoose';

//This schema stores ingredients used in recipes or shopping lists
const IngredientSchema = new mongoose.Schema({
    name: {type: String, required: true},
    unit: String, //grams, ml, etc
    defaultQuantity: Number,
    nutritionInfo: Object
});
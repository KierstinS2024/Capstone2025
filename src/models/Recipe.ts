import mongoose from 'mongoose';

// This is my Recipe schema: it stores recipes my users create or import
const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  instructions: [String], // Each step of the recipe
  nutritionInfo: Object, // Calories, macros, etc.
  cuisine: String,
  userSubmitted: { type: Boolean, default: false },
  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// I export it so I can create, read, update, delete recipes in my API
export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

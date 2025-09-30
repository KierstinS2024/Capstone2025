// ===========================================
// PATH: src/lib/db.ts
// Centralized MongoDB connection + models
// -------------------------------------------
// - Ensures a single cached MongoDB connection
// - Defines Mongoose models for MealPlans & Recipes
// - Exports helper functions for CRUD operations
// - Recipes untouched (your current flow works)
// - MealPlans updated to:
//   • Include weekStartDate / weekEndDate
//   • Enforce "one meal plan per user"
// ===========================================

import mongoose from "mongoose";

// ====================================================
// Connection Management (Singleton Pattern)
// ====================================================
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) throw new Error("Please set MONGODB_URI in .env.local");

// Cache connection across hot reloads in dev
let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// ====================================================
// MealPlan Schema & Model
// ====================================================
// Each user can have *at most one* meal plan.
// If they want a new one, they must delete the old one.
// Each plan covers exactly one week (start → end).
const mealPlanSchema = new mongoose.Schema(
  {
    author: { type: String, required: true }, // user email
    meals: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Required fields for weekly context
    weekStartDate: { type: String, required: true }, // e.g. "2025-09-29"
    weekEndDate: { type: String, required: true }, // e.g. "2025-10-05"
  },
  { timestamps: true } // adds createdAt / updatedAt
);

// ✅ Enforce "one meal plan per user"
mealPlanSchema.index({ author: 1 }, { unique: true });

const MealPlanModel =
  mongoose.models.MealPlan || mongoose.model("MealPlan", mealPlanSchema);

// ====================================================
// Recipe Schema & Model
// ====================================================
// (unchanged from your working version)
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    image: { type: String },
    source: { type: String, enum: ["user", "spoonacular"], default: "user" },
    author: { type: String, required: true }, // user email
  },
  { timestamps: true }
);

const RecipeModel =
  mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

// ====================================================
// Normalizer (Mongo _id → id for client use)
// ====================================================
function normalize(doc: any) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj._id.toString(),
    _id: undefined,
  };
}

// ====================================================
// MealPlan Helpers
// ====================================================
export async function getAllMealPlans(author: string) {
  await connectDB();
  const docs = await MealPlanModel.find({ author }).lean();
  return docs.map(normalize);
}

export async function createMealPlan(data: any) {
  await connectDB();

  // Prevent duplicate plan (one per user)
  const existing = await MealPlanModel.findOne({ author: data.author });
  if (existing) {
    throw new Error("User already has an active meal plan");
  }

  const plan = new MealPlanModel(data);
  const saved = await plan.save();
  return normalize(saved);
}

export async function getMealPlanById(id: string) {
  await connectDB();
  const doc = await MealPlanModel.findById(id).lean();
  return normalize(doc);
}

export async function updateMealPlanById(id: string, updates: any) {
  await connectDB();
  const doc = await MealPlanModel.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();
  return normalize(doc);
}

export async function deleteMealPlanById(id: string) {
  await connectDB();
  return MealPlanModel.findByIdAndDelete(id);
}

// ====================================================
// Recipe Helpers
// ====================================================
export async function getAllRecipes(author: string) {
  await connectDB();
  const docs = await RecipeModel.find({ author }).lean();
  return docs.map(normalize);
}

export async function getRecipeById(id: string) {
  await connectDB();
  const doc = await RecipeModel.findById(id).lean();
  return normalize(doc);
}

export async function createRecipe(data: any) {
  await connectDB();
  const recipe = new RecipeModel(data);
  const saved = await recipe.save();
  return normalize(saved);
}

export async function updateRecipeById(id: string, updates: any) {
  await connectDB();
  const doc = await RecipeModel.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();
  return normalize(doc);
}

export async function deleteRecipeById(id: string) {
  await connectDB();
  return RecipeModel.findByIdAndDelete(id);
}

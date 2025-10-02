// ===========================================
// PATH: src/lib/db.ts
// Centralized MongoDB connection + models
// -------------------------------------------
// - Ensures a single cached MongoDB connection
// - Defines Mongoose models for MealPlans, Recipes, ShoppingList
// - Exports helper functions for CRUD operations
// ===========================================

import mongoose from "mongoose";
import ShoppingList, {
  IShoppingList,
  IShoppingListItem,
} from "@/models/ShoppingList";

// ====================================================
// Connection Management (Singleton Pattern)
// ====================================================
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) throw new Error("Please set MONGODB_URI in .env.local");

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
const mealPlanSchema = new mongoose.Schema(
  {
    author: { type: String, required: true }, // user email
    meals: { type: mongoose.Schema.Types.Mixed, default: {} },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  { timestamps: true }
);

mealPlanSchema.index({ author: 1 }, { unique: true });

const MealPlanModel =
  mongoose.models.MealPlan || mongoose.model("MealPlan", mealPlanSchema);

// ====================================================
// Recipe Schema & Model
// ====================================================
const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    image: { type: String },
    source: { type: String, enum: ["user", "spoonacular"], default: "user" },
    author: { type: String, required: true },
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

// ====================================================
// Shopping List Helpers (by ownerEmail)
// ====================================================

// Normalizer: Mongo _id → id (for both list + subdocs)
function normalizeShoppingList(list: any) {
  if (!list) return null;

  const obj = list.toObject ? list.toObject() : list;

  return {
    id: obj._id.toString(),
    ownerEmail: obj.ownerEmail,
    items: obj.items.map((i: any) => ({
      id: i._id.toString(),
      name: i.name,
      checked: i.checked,
    })),
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

// -----------------------------
// Fetch user's shopping list (creates one if missing)
// -----------------------------
export async function getShoppingList(ownerEmail: string) {
  await connectDB();
  let list = await ShoppingList.findOne({ ownerEmail });
  if (!list) {
    list = await ShoppingList.create({ ownerEmail, items: [] });
  }
  return normalizeShoppingList(list);
}

// -----------------------------
// Add a single item
// -----------------------------
export async function addShoppingListItem(ownerEmail: string, name: string) {
  await connectDB();
  let list = await ShoppingList.findOne({ ownerEmail });
  if (!list) list = await ShoppingList.create({ ownerEmail, items: [] });

  list.items.push({ name, checked: false });
  await list.save();

  return normalizeShoppingList(list);
}

// -----------------------------
// Add multiple items at once
// -----------------------------
export async function addBulkShoppingListItems(
  ownerEmail: string,
  items: string[]
) {
  await connectDB();
  let list = await ShoppingList.findOne({ ownerEmail });
  if (!list) list = await ShoppingList.create({ ownerEmail, items: [] });

  items.forEach((name) => list!.items.push({ name, checked: false }));
  await list.save();

  return normalizeShoppingList(list);
}

// -----------------------------
// Toggle checked/unchecked on one item
// -----------------------------
export async function toggleShoppingListItem(
  ownerEmail: string,
  itemId: string
) {
  await connectDB();
  const list = await ShoppingList.findOne({ ownerEmail });
  if (!list) throw new Error("Shopping list not found");

  // Convert to ObjectId to match subdocument keys
  const objectId = new mongoose.Types.ObjectId(itemId);
  const item = list.items.id(objectId);
  if (!item) throw new Error("Item not found");

  item.checked = !item.checked;
  await list.save();

  return normalizeShoppingList(list);
}

// -----------------------------
// Delete a single item
// -----------------------------
export async function deleteShoppingListItem(
  ownerEmail: string,
  itemId: string
) {
  await connectDB();
  const list = await ShoppingList.findOne({ ownerEmail });
  if (!list) throw new Error("Shopping list not found");

  const objectId = new mongoose.Types.ObjectId(itemId);
  const item = list.items.id(objectId);
  if (!item) throw new Error("Item not found");

  item.deleteOne();
  await list.save();

  return normalizeShoppingList(list);
}

// -----------------------------
// Clear all items
// -----------------------------
export async function clearShoppingList(ownerEmail: string) {
  await connectDB();
  const list = await ShoppingList.findOne({ ownerEmail });
  if (!list) throw new Error("Shopping list not found");

  list.items = [];
  await list.save();

  return normalizeShoppingList(list);
}


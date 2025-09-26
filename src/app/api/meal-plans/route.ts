// ===========================================
// PATH: src/app/api/meal-plans/route.ts
//
// API Route for Meal Plans (collection-level)
// Handles GET and POST requests.
//
// Business Rule: **Only ONE active meal plan per user**
// - GET → returns the user's current meal plan (or null if none)
// - POST → creates a new meal plan, but blocks if user already has one
//
// This keeps the UX simple: the user either *has* a plan or *doesn't*.
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";              // DB connection helper
import MealPlan from "@/models/MealPlan";          // Mongoose model
import { getUserFromRequest } from "@/lib/serverAuth"; // Auth helper

// -------------------------------------------
// Helper: normalizeMeals()
// Ensures each "day" entry has all 3 standard meal slots
// (breakfast, lunch, dinner). If a slot is missing, it’s set to null.
// -------------------------------------------
function normalizeMeals(meals: any = {}) {
  const normalized: Record<
    string,
    { breakfast: string | null; lunch: string | null; dinner: string | null }
  > = {};

  // Walk each day entry from the request
  Object.entries(meals).forEach(([day, slots]) => {
    const s = slots as Partial<
      Record<"breakfast" | "lunch" | "dinner", string | null>
    >;

    // Fill missing slots with null
    normalized[day] = {
      breakfast: s?.breakfast ?? null,
      lunch: s?.lunch ?? null,
      dinner: s?.dinner ?? null,
    };
  });

  return normalized;
}

// -------------------------------------------
// Helper: formatMealPlan()
// Converts a MongoDB MealPlan document into a clean JSON object
// - ObjectId → string
// - Dates → ISO string
// - Meals → normalized
// -------------------------------------------
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate: doc.startDate,
    endDate: doc.endDate,
    meals: normalizeMeals(doc.meals),
    user: doc.user?.toString() || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// -----------------------------
// GET /api/meal-plans
//
// Returns the authenticated user's active meal plan.
// If no plan exists, returns `null` instead of an empty array.
// -----------------------------
export async function GET(req: NextRequest) {
  await connectDB();

  // ✅ Authenticate user
  const payload = await getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;

  // Fetch at most ONE plan for this user
  // (We assume schema + app logic prevent multiple)
  const plan = await MealPlan.findOne({ user: userId }).lean();

  // Respond with normalized JSON or null
  return NextResponse.json(plan ? formatMealPlan(plan) : null);
}

// -----------------------------
// POST /api/meal-plans
//
// Creates a new meal plan for the authenticated user.
// - Rejects if user already has one
// - Validates date fields
// - Normalizes meals
// -----------------------------
export async function POST(req: NextRequest) {
  await connectDB();

  // ✅ Authenticate user
  const payload = await getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;

  try {
    // Parse request body
    const body = await req.json();
    const { startDate, endDate, title } = body;

    // -----------------------------
    // Basic date validation
    // -----------------------------
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid startDate or endDate" },
        { status: 400 }
      );
    }

    // Prevent inverted date ranges
    if (end < start) {
      return NextResponse.json(
        { error: "endDate cannot be before startDate" },
        { status: 400 }
      );
    }

    // -----------------------------
    // Block creation if user already has a plan
    // -----------------------------
    const existing = await MealPlan.findOne({ user: userId }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "You already have an active meal plan. Delete it first." },
        { status: 400 }
      );
    }

    // -----------------------------
    // Build safe insert object
    // - Normalizes meals
    // - Defaults title if missing
    // - Associates user ID
    // -----------------------------
    const safeBody = {
      ...body,
      meals: normalizeMeals(body.meals),
      title: title || `Meal Plan ${startDate} → ${endDate}`,
      user: userId,
    };

    // Insert into MongoDB
    const plan = await MealPlan.create(safeBody);

    // Respond with normalized JSON
    return NextResponse.json(formatMealPlan(plan));
  } catch (err: any) {
    console.error("Failed to create meal plan:", err);

    // Return generic safe error
    return NextResponse.json(
      { error: err.message || "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

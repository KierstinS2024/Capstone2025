// ===========================================
// PATH: src/app/api/meal-plans/route.ts
//
// API Route for Meal Plans (collection-level)
// Handles GET and POST requests.
// -------------------------------------------
// Business Rule: Only ONE active meal plan per user
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// -------------------------------------------
// Helper: normalizeMeals()
// Ensures each day entry has breakfast/lunch/dinner keys
// -------------------------------------------
function normalizeMeals(
  meals: Record<
    string,
    Partial<Record<"breakfast" | "lunch" | "dinner", string | null>>
  > = {}
) {
  const normalized: Record<
    string,
    { breakfast: string | null; lunch: string | null; dinner: string | null }
  > = {};

  for (const [day, slots] of Object.entries(meals)) {
    normalized[day] = {
      breakfast: slots?.breakfast ?? null,
      lunch: slots?.lunch ?? null,
      dinner: slots?.dinner ?? null,
    };
  }
  return normalized;
}

// -------------------------------------------
// Helper: formatMealPlan()
// Converts MongoDB doc → frontend JSON
// - Dates: Date → ISO string (YYYY-MM-DD)
// -------------------------------------------
function formatMealPlan(doc: any) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    startDate:
      doc.startDate instanceof Date
        ? doc.startDate.toISOString().split("T")[0]
        : doc.startDate,
    endDate:
      doc.endDate instanceof Date
        ? doc.endDate.toISOString().split("T")[0]
        : doc.endDate,
    meals: normalizeMeals(doc.meals),
    user: doc.user?.toString() || null,
    createdAt: doc.createdAt?.toISOString?.(),
    updatedAt: doc.updatedAt?.toISOString?.(),
  };
}

// -----------------------------
// GET /api/meal-plans
// Returns user's plan or null
// -----------------------------
export async function GET(req: NextRequest) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await MealPlan.findOne({ user: payload.id }).lean();
  return NextResponse.json(plan ? formatMealPlan(plan) : null);
}

// -----------------------------
// POST /api/meal-plans
// Creates a new meal plan
// -----------------------------
export async function POST(req: NextRequest) {
  await connectDB();

  const payload = await getUserFromRequest(req);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = payload.id;

  try {
    const body = await req.json();
    const { startDate, endDate, title } = body;

    // ✅ Validate required dates
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid startDate or endDate" },
        { status: 400 }
      );
    }
    if (end < start) {
      return NextResponse.json(
        { error: "endDate cannot be before startDate" },
        { status: 400 }
      );
    }

    // ✅ Block if plan exists
    const existing = await MealPlan.findOne({ user: userId }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "You already have an active meal plan. Delete it first." },
        { status: 400 }
      );
    }

    // ✅ Build safe insert object
    const safeBody = {
      ...body,
      meals: normalizeMeals(body.meals),
      title: title || `Meal Plan ${startDate} → ${endDate}`,
      startDate: start,
      endDate: end,
      user: userId,
    };

    const plan = await MealPlan.create(safeBody);
    return NextResponse.json(formatMealPlan(plan));
  } catch (err: any) {
    console.error("Failed to create meal plan:", err);

    if (err.code === 11000) {
      return NextResponse.json(
        { error: "User already has an active meal plan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create meal plan" },
      { status: 500 }
    );
  }
}

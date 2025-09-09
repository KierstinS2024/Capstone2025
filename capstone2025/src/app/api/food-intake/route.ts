// Path: src/app/api/food-intake/route.ts
"use server";

/**
 * Food Intake Collection API
 * -------------------------
 * GET  → List all food intake logs for current user
 * POST → Log a new food intake entry (JWT required)
 * Features:
 * - Lean queries for GET
 * - Zod validation for POST
 * - Cookie-based JWT auth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import FoodIntake from "@/models/FoodIntake";
import { requireAuth } from "@/lib/authHelpers";
import { z, ZodError } from "zod";
import { foodIntakeFormSchema } from "@/schemas/food-intake/foodIntakeForm";

/**
 * GET /api/food-intake
 * - Fetch all food intake logs for authenticated user
 * - Sorted by date descending
 * - Lean query for performance
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const entries = await FoodIntake.find({ userId }).sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, data: entries });
  } catch (err) {
    console.error("GET /api/food-intake error:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch food intake logs",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/food-intake
 * - Logs a new food intake entry for current user
 * - Validates input with Zod
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const body = await req.json();
    const parsed = foodIntakeFormSchema.parse(body);

    const newEntry = await FoodIntake.create({ ...parsed, userId });
    return NextResponse.json(
      { success: true, data: newEntry },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/food-intake error:", err);

    if (err instanceof ZodError) {
      const message = err.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Failed to create food intake entry",
      },
      { status: 500 }
    );
  }
}

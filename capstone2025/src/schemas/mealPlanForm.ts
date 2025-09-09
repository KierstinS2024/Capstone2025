// Path: src/schemas/mealPlanForm.ts
// Purpose: Zod schema for validating MealPlan form inputs

import { z } from "zod";

/**
 * Single meal entry schema
 * - Links to food intake entries (ingredient or recipe)
 * - Optional notes per meal
 */
export const mealPlanEntrySchema = z
  .object({
    date: z.string().nonempty("Date is required"),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    foodItems: z
      .array(
        z.object({
          recipeId: z.string().optional(),
          ingredientId: z.string().optional(),
          quantity: z.number().positive("Quantity must be greater than 0"),
          unit: z.string().nonempty("Unit is required"),
          // Corrected record usage: key type = string, value type = any
          nutritionSnapshot: z.record(z.string(), z.any()).optional(),
        })
      )
      .min(1, "At least one food item is required"),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.foodItems.every((item) => item.recipeId || item.ingredientId),
    { message: "Each food item must have either a recipeId or ingredientId" }
  );

/**
 * MealPlan form schema
 */
export const mealPlanFormSchema = z.object({
  title: z.string().min(1, "Meal plan title is required"),
  entries: z.array(mealPlanEntrySchema).optional(),
});

/**
 * TypeScript types inferred from schemas
 */
export type MealPlanEntryType = z.infer<typeof mealPlanEntrySchema>;
export type MealPlanFormType = z.infer<typeof mealPlanFormSchema>;

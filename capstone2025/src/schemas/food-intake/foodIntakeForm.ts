// Path: src/schemas/food-intake/foodIntakeForm.ts
// Purpose: Zod schema for validating FoodIntake form inputs

import { z } from "zod";

/**
 * FoodIntake form validation schema
 * - Ensures either recipeId or ingredientId is provided
 * - Optional nutritionSnapshot as a record with string keys and any values
 */
export const foodIntakeFormSchema = z
  .object({
    date: z.string().nonempty("Date is required"),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
    unit: z.string().nonempty("Unit is required"),
    recipeId: z.string().optional(),
    ingredientId: z.string().optional(),
    nutritionSnapshot: z.record(z.string(), z.any()).optional(),
  })
  .refine((data) => data.recipeId || data.ingredientId, {
    message: "Either recipeId or ingredientId must be provided",
    path: ["recipeId"], // Optional: points error to recipeId field
  });

/**
 * TypeScript type inferred from schema
 */
export type FoodIntakeFormType = z.infer<typeof foodIntakeFormSchema>;

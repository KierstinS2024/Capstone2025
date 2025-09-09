// Path: src/schemas/ingredientForm.ts
// Purpose: Zod schema for validating Ingredient form inputs

import { z } from "zod";

/**
 * Ingredient form validation schema
 * - name: required string
 * - unit: required string (grams, liters, etc.)
 * - defaultQuantity: optional number (default amount)
 * - nutritionInfo: optional object with macros (calories, protein, fat, carbs)
 */
export const ingredientFormSchema = z.object({
  name: z.string().nonempty("Ingredient name is required"),
  unit: z.string().nonempty("Unit is required"),
  defaultQuantity: z
    .number()
    .min(0, "Quantity must be 0 or greater")
    .optional(),
  nutritionInfo: z
    .object({
      calories: z.number().min(0).optional(),
      protein: z.number().min(0).optional(),
      fat: z.number().min(0).optional(),
      carbs: z.number().min(0).optional(),
    })
    .optional(),
});

// TypeScript type inferred from schema
export type IngredientFormSchema = z.infer<typeof ingredientFormSchema>;

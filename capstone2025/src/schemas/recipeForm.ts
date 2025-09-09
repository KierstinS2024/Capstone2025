// Path: src/schemas/recipeForm.ts
import { z } from "zod";

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "Ingredient is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.string().optional(),
});

export const recipeFormSchema = z.object({
  title: z.string().nonempty("Recipe title is required"),
  description: z.string().nonempty("Description is required"),
  instructions: z
    .array(z.string().nonempty("Instruction cannot be empty"))
    .optional(),
  cuisine: z.string().optional(),
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, "At least one ingredient is required"),
});

export type RecipeFormType = z.infer<typeof recipeFormSchema>;

// Path: src/schemas/shoppingListForm.ts
// Purpose: Zod schema for validating ShoppingList form inputs

import { z } from "zod";

/**
 * Single shopping list item schema
 */
export const shoppingListItemSchema = z.object({
  ingredientId: z.string().min(1, "Ingredient ID is required"),
  name: z.string().optional(), // optional if you want to allow just the ID
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: z.string().nonempty("Unit is required"),
  purchased: z.boolean().optional(),
});

/**
 * ShoppingList form schema
 */
export const shoppingListFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(shoppingListItemSchema).optional(),
});

/**
 * TypeScript types inferred from schemas
 */
export type ShoppingListItemType = z.infer<typeof shoppingListItemSchema>;
export type ShoppingListFormType = z.infer<typeof shoppingListFormSchema>;
